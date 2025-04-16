import { supabase as clientSupabase } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Interface for scoring weights configuration
 */
export interface ScoringWeights {
  safeBrowsing: number;
  domainAge: number;
  ssl: number;
  dns: number;
  patternAnalysis: number;
  baselineScore: number;
}

/**
 * Interface for risk factor penalty configuration
 */
export interface RiskFactorPenalties {
  manyRiskFactors: number;
  severalRiskFactors: number;
  privacyProtection: number;
  whoisError: number;
}

/**
 * Get the current scoring weights configuration
 */
export async function getScoringWeights(
  customClient?: SupabaseClient
): Promise<ScoringWeights> {
  // Use provided client or fallback to default client
  const supabase = customClient || clientSupabase;

  try {
    const { data, error } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "scoring_weights")
      .single();

    if (error) {
      console.error("Error fetching scoring weights:", error);
      // For certain errors like "relation does not exist", throw a specific error
      if (
        error.message &&
        error.message.includes('relation "system_settings" does not exist')
      ) {
        throw new Error("Database table not initialized");
      }
      throw error;
    }

    if (!data || !data.value) {
      console.warn("Scoring weights not found in database, using defaults");
      return getDefaultScoringWeights();
    }

    return data.value as ScoringWeights;
  } catch (error) {
    console.error("Failed to get scoring weights:", error);
    // Return default weights if database query fails
    return getDefaultScoringWeights();
  }
}

/**
 * Get default scoring weights
 */
export function getDefaultScoringWeights(): ScoringWeights {
  return {
    safeBrowsing: 30,
    domainAge: 20,
    ssl: 15,
    dns: 15,
    patternAnalysis: 20,
    baselineScore: 70,
  };
}

/**
 * Update the scoring weights configuration
 */
export async function updateScoringWeights(
  weights: ScoringWeights,
  customClient?: SupabaseClient
): Promise<void> {
  // Use provided client or fallback to default client
  const supabase = customClient || clientSupabase;

  try {
    const { error } = await supabase
      .from("system_settings")
      .update({ value: weights })
      .eq("key", "scoring_weights");

    if (error) {
      console.error("Error updating scoring weights:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to update scoring weights:", error);
    throw error;
  }
}

/**
 * Get the current risk factor penalties configuration
 */
export async function getRiskFactorPenalties(
  customClient?: SupabaseClient
): Promise<RiskFactorPenalties> {
  // Use provided client or fallback to default client
  const supabase = customClient || clientSupabase;

  try {
    const { data, error } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "risk_factor_penalties")
      .single();

    if (error) {
      console.error("Error fetching risk factor penalties:", error);
      if (
        error.message &&
        error.message.includes('relation "system_settings" does not exist')
      ) {
        throw new Error("Database table not initialized");
      }
      throw error;
    }

    if (!data || !data.value) {
      console.warn(
        "Risk factor penalties not found in database, using defaults"
      );
      return getDefaultRiskFactorPenalties();
    }

    return data.value as RiskFactorPenalties;
  } catch (error) {
    console.error("Failed to get risk factor penalties:", error);
    // Return default penalties if database query fails
    return getDefaultRiskFactorPenalties();
  }
}

/**
 * Get default risk factor penalties
 */
export function getDefaultRiskFactorPenalties(): RiskFactorPenalties {
  return {
    manyRiskFactors: 8,
    severalRiskFactors: 4,
    privacyProtection: 2,
    whoisError: 3,
  };
}

/**
 * Update the risk factor penalties configuration
 */
export async function updateRiskFactorPenalties(
  penalties: RiskFactorPenalties,
  customClient?: SupabaseClient
): Promise<void> {
  // Use provided client or fallback to default client
  const supabase = customClient || clientSupabase;

  try {
    const { error } = await supabase
      .from("system_settings")
      .update({ value: penalties })
      .eq("key", "risk_factor_penalties");

    if (error) {
      console.error("Error updating risk factor penalties:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to update risk factor penalties:", error);
    throw error;
  }
}

/**
 * Get a setting by key
 */
export async function getSettingByKey(
  key: string,
  customClient?: SupabaseClient
): Promise<any> {
  // Use provided client or fallback to default client
  const supabase = customClient || clientSupabase;

  try {
    const { data, error } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error) {
      console.error(`Error fetching setting ${key}:`, error);
      throw error;
    }

    if (!data || !data.value) {
      console.warn(`Setting ${key} not found in database`);
      return null;
    }

    return data.value;
  } catch (error) {
    console.error(`Failed to get setting ${key}:`, error);
    throw error;
  }
}

/**
 * Update a setting by key
 */
export async function updateSettingByKey(
  key: string,
  value: any,
  customClient?: SupabaseClient
): Promise<void> {
  // Use provided client or fallback to default client
  const supabase = customClient || clientSupabase;

  try {
    // Check if setting exists
    const { data, error: checkError } = await supabase
      .from("system_settings")
      .select("id")
      .eq("key", key)
      .maybeSingle();

    if (checkError) {
      console.error(`Error checking for setting ${key}:`, checkError);
      throw checkError;
    }

    if (data) {
      // Update existing setting
      const { error } = await supabase
        .from("system_settings")
        .update({ value })
        .eq("key", key);

      if (error) {
        console.error(`Error updating setting ${key}:`, error);
        throw error;
      }
    } else {
      // Insert new setting
      const { error } = await supabase
        .from("system_settings")
        .insert({ key, value });

      if (error) {
        console.error(`Error inserting setting ${key}:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error(`Failed to update setting ${key}:`, error);
    throw error;
  }
}
