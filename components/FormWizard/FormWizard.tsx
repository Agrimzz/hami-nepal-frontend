// components/form-kit/FormWizard.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { FormProvider, UseFormReturn, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { z } from "zod";
import { CustomButton } from "../Form";
import { FormWizardProps, StepDef } from "./FormWizard.type";

/** Section shell (reuse across both modes) */

export function FormWizard<S extends z.ZodObject<any>>({
  title,
  schema,
  defaultValues,
  renderSections,
  steps,
  submitLabel = "Submit",
  onSubmit,
  stickyFooter = true,
  unregisterOnExit = false,
}: FormWizardProps<S>) {
  type FV = z.infer<S>;
  const isStepper = !!steps?.length;

  const methods = useForm<FV>({
    defaultValues,
    resolver: zodResolver(schema) as any,
    mode: "onSubmit",
    shouldUnregister: unregisterOnExit,
  });

  const submit = methods.handleSubmit(onSubmit);

  if (!isStepper) {
    // simple (non‑stepper) mode
    return (
      <FormProvider {...methods}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View className="p-4 gap-4 h-full">
              <Text className="text-white font-psemibold text-3xl text-center py-2">
                {title}
              </Text>
              {renderSections ? renderSections(methods) : null}
              <CustomButton title={submitLabel} handlePress={submit} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </FormProvider>
    );
  }

  // stepper mode
  return (
    <FormProvider {...methods}>
      <WizardStepperBody
        title={title}
        methods={methods}
        steps={steps!}
        submitLabel={submitLabel}
        stickyFooter={stickyFooter}
        onSubmit={submit}
      />
    </FormProvider>
  );
}

/** Child component that owns stepper hooks */
function WizardStepperBody<S extends z.ZodObject<any>>(props: {
  title: string;
  methods: UseFormReturn<z.infer<S>>;
  steps: StepDef<S>[];
  submitLabel: string;
  stickyFooter: boolean;
  onSubmit: () => void;
}) {
  const { methods, steps, submitLabel, stickyFooter, onSubmit } = props;
  const [idx, setIdx] = useState(0);
  const last = idx === steps.length - 1;
  const current = steps[idx];

  const jumpTo = async (target: number) => {
    if (target <= idx) {
      // back (or same) — always allowed
      setIdx(target);
      return;
    }

    // forward — validate each intermediate step
    for (let i = idx; i < target; i++) {
      const fields = steps[i].fields ?? [];
      const ok = fields.length ? await methods.trigger(fields as any) : true;
      if (!ok) {
        setIdx(i);
        return;
      }
    }
    setIdx(target);
  };

  const header = useMemo(() => {
    const current = steps[idx];
    const next = steps[idx + 1];

    return (
      <View className="gap-4">
        {props.title ? (
          <Text className="text-white font-psemibold text-3xl text-center py-2">
            {props.title}
          </Text>
        ) : null}

        <View className="flex flex-row justify-between items-center">
          <Pressable onPress={() => jumpTo(idx - 1)} disabled={idx === 0}>
            <Text className="text-sm text-white font-pbold">
              Step {idx + 1}: {current.title}
            </Text>
          </Pressable>
          {next ? (
            <Pressable onPress={() => jumpTo(idx + 1)}>
              <Text className="text-sm text-lightgray font-pbold">
                Next: {next.title}
              </Text>
            </Pressable>
          ) : (
            <Text className="text-sm text-lightgray font-pbold">Last step</Text>
          )}
        </View>

        <View className="flex-row items-center justify-between gap-2">
          {steps.map((s, i) => {
            const active = i === idx;
            const completed = i < idx;
            return (
              <Pressable
                key={s.key}
                onPress={() => jumpTo(i)}
                className={`flex-1 h-[3] rounded-2xl ${
                  active
                    ? "bg-primary"
                    : completed
                      ? "bg-primary/40"
                      : "bg-white/15"
                }`}
                accessibilityRole="button"
                accessibilityLabel={`Go to step ${i + 1}: ${s.title}`}
              />
            );
          })}
        </View>
      </View>
    );
  }, [idx, steps]);

  const goBack = () => setIdx((p) => Math.max(p - 1, 0));
  const goNext = async () => {
    const fields = current.fields ?? [];
    const ok = fields.length ? await methods.trigger(fields as any) : true;
    if (!ok) return;
    setIdx((p) => Math.min(p + 1, steps.length - 1));
  };

  return (
    <View className="flex-1 relative px-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className=" flex-1 pt-4 gap-4 relative">
            {header}

            <View key={`step-${current.key}`} className="gap-4 mt-4">
              {current.render(methods)}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        className={`flex-row gap-2 px-4 ${stickyFooter ? "absolute bottom-0 pb-2" : ""}`}
      >
        {current === steps[0] ? (
          <CustomButton
            title="Cancel"
            handlePress={() => router.back()}
            containerStyles="w-[40%] bg-transparent"
            leftSection={<X size={20} color="white" />}
          />
        ) : (
          <CustomButton
            title="Back"
            handlePress={goBack}
            containerStyles="w-[40%] bg-transparent"
            disabled={idx === 0}
            leftSection={<ChevronLeft size={20} color="white" />}
          />
        )}
        {!last ? (
          <CustomButton
            title="Next"
            handlePress={goNext}
            containerStyles="w-[60%] "
            rightSeciton={<ChevronRight size={20} color="white" />}
          />
        ) : (
          <CustomButton
            title={submitLabel}
            handlePress={onSubmit}
            containerStyles="w-[60%] "
          />
        )}
      </View>
    </View>
  );
}
