import { promises as dns } from "dns";

interface DNSAnalysisResult {
  hasMX: boolean;
  hasSPF: boolean;
  hasDMARC: boolean;
  mxRecords: string[];
  txtRecords: string[];
  spfRecord?: string;
  dmarcRecord?: string;
  riskFactors: string[];
  securityScore: number;
}

export async function analyzeDNS(domain: string): Promise<DNSAnalysisResult> {
  const result: DNSAnalysisResult = {
    hasMX: false,
    hasSPF: false,
    hasDMARC: false,
    mxRecords: [],
    txtRecords: [],
    riskFactors: [],
    securityScore: 0,
  };

  try {
    // Check MX records
    try {
      const mxRecords = await dns.resolveMx(domain);
      result.hasMX = mxRecords.length > 0;
      result.mxRecords = mxRecords.map(
        (record) => `${record.exchange} (priority: ${record.priority})`
      );

      if (!result.hasMX) {
        result.riskFactors.push("Domain has no email server (MX) records");
      } else {
        result.securityScore += 5; // Legitimate domains typically have MX records
      }
    } catch (error) {
      result.riskFactors.push("Failed to retrieve MX records");
    }

    // Check TXT records (includes SPF)
    try {
      const txtRecords = await dns.resolveTxt(domain);
      result.txtRecords = txtRecords.map((record) => record.join(""));

      // Check for SPF record
      const spfRecord = result.txtRecords.find((record) =>
        record.startsWith("v=spf1")
      );
      result.hasSPF = !!spfRecord;
      if (spfRecord) {
        result.spfRecord = spfRecord;
        result.securityScore += 5; // SPF records are good for security
      } else {
        result.riskFactors.push("Domain has no SPF record for email security");
      }
    } catch (error) {
      result.riskFactors.push("Failed to retrieve TXT records");
    }

    // Check DMARC record
    try {
      const dmarcRecords = await dns.resolveTxt(`_dmarc.${domain}`);
      const dmarcRecord = dmarcRecords.find((record) =>
        record.join("").startsWith("v=DMARC1")
      );
      result.hasDMARC = !!dmarcRecord;

      if (dmarcRecord) {
        result.dmarcRecord = dmarcRecord.join("");
        result.securityScore += 10; // DMARC is even more important for email security
      } else {
        result.riskFactors.push(
          "Domain has no DMARC policy for email security"
        );
      }
    } catch (error) {
      // DMARC records commonly don't exist, so don't add as risk factor
    }

    // Additional DNS checks can be implemented here in the future
    // For example: CAA records, DNSSEC validation, etc.
  } catch (error) {
    console.error("DNS analysis error:", error);
    result.riskFactors.push("Error performing DNS analysis");
  }

  return result;
}
