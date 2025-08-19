import { ReactNode } from "react";
import { DefaultValues, UseFormReturn } from "react-hook-form";
import { z } from "zod";

export type StepDef<S extends z.ZodObject<any>> = {
  key: string;
  title: string;
  description?: string;
  /** field names to validate on "Next" */
  fields?: string[];
  /** render the body of this step */
  render: (methods: UseFormReturn<z.infer<S>>) => ReactNode;
};

export type FormWizardProps<S extends z.ZodObject<any>> = {
  title: string;
  schema: S;
  defaultValues: DefaultValues<z.infer<S>>;
  renderSections?: (methods: UseFormReturn<z.infer<S>>) => ReactNode;
  steps?: StepDef<S>[];
  submitLabel?: string;
  onSubmit: (values: z.infer<S>) => void | Promise<void>;
  stickyFooter?: boolean;
  unregisterOnExit?: boolean;
};
