// Geography classification models used by category nomination forms.

export type GeographyModel =
  | "ICON_CLASSIFICATION"
  | "AFRICA_REGION_COUNTRY"
  | "NIGERIA_STATE_ZONE"
  | "NIGERIA_STATE_ONLY"
  | "DIASPORA_COUNTRY_IMPACT"
  | "INTERNATIONAL_PARTNERSHIP"
  | "MULTI_COUNTRY_AFRICA";

export const GEOGRAPHY_MODEL_LABELS: Record<GeographyModel, string> = {
  ICON_CLASSIFICATION: "Icon Classification (African in Africa · Diaspora African · Friend of Africa)",
  AFRICA_REGION_COUNTRY: "African Region + Country",
  NIGERIA_STATE_ZONE: "Nigerian State + Geopolitical Zone",
  NIGERIA_STATE_ONLY: "Nigerian State",
  DIASPORA_COUNTRY_IMPACT: "Diaspora Country of Residence + African Country of Impact",
  INTERNATIONAL_PARTNERSHIP: "International Partner Country + African Partner Countries",
  MULTI_COUNTRY_AFRICA: "Multi-Country African Programme Reach",
};
