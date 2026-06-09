/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
      maxLength: 120,
    },
    {
      fieldName: "heroTitle",
      type: "string",
      required: false,
      label: "Hero Title",
      maxLength: 80,
    },
    {
      fieldName: "heroSubtitle",
      type: "string",
      required: false,
      label: "Hero Subtitle",
      maxLength: 300,
    },
    {
      fieldName: "uploadCtaLabel",
      type: "string",
      required: false,
      label: "Upload CTA Label",
      maxLength: 60,
    },
    {
      fieldName: "supportedFormatsLabel",
      type: "string",
      required: false,
      label: "Supported Formats Label",
      maxLength: 100,
    },
    {
      fieldName: "maxFileSizeMb",
      type: "number",
      required: false,
      label: "Max File Size (MB)",
      min: 1,
      max: 200,
    },
    {
      fieldName: "analysisSteps",
      type: "array",
      label: "Analysis Step Labels",
      item: { type: "string", required: true },
    },
    {
      fieldName: "footerText",
      type: "string",
      required: false,
      label: "Footer Text",
      maxLength: 200,
    },
    {
      fieldName: "showDashboardHistory",
      type: "boolean",
      required: false,
      label: "Show Analysis History on Dashboard",
    },
  ],
};
