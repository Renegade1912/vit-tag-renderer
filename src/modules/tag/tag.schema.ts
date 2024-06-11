import { buildJsonSchemas } from "fastify-zod";
import z from "zod";

const tagCore = {
  height: z.coerce
    .number({
      required_error: "Höhe wird benötigt",
      invalid_type_error: "Höhe muss eine Zahl sein",
    })
    .min(1, "Höhe muss eine positive Zahl größer 0 sein")
    .max(2048, "Höhe muss eine positive Zahl kleiner 2048 sein"),
  width: z.coerce
    .number({
      required_error: "Breite wird benötigt",
      invalid_type_error: "Breite muss eine Zahl sein",
    })
    .min(1, "Breite muss eine positive Zahl größer 0 sein")
    .max(4096, "Breite muss eine positive Zahl kleiner 4096 sein"),
};

const renderTagScheduleSchema = z.object({
  ...tagCore,
  name: z.string({
    required_error: "Name wird benötigt",
    invalid_type_error: "Name muss ein String sein",
  }),
  date: z.string({
    required_error: "Datum wird benötigt",
    invalid_type_error: "Datum muss ein String sein",
  }),
  url: z
    .string({
      required_error: "Sie müssen eine URL angeben",
      invalid_type_error: "Die URL ist ungültig",
    })
    .url("Die URL ist ungültig"),
  events: z.array(
    z.object({
      desc: z.string({
        required_error: "Terminbeschreibung wird benötigt",
        invalid_type_error: "Terminbeschreibung muss ein String sein",
      }),
      start: z.string({
        required_error: "Startzeit wird benötigt",
        invalid_type_error: "Startzeit muss ein String sein",
      }),
      end: z.string(
        z.string({
          required_error: "Endzeit wird benötigt",
          invalid_type_error: "Endzeit muss ein String sein",
        })
      ),
    }),
    {
      required_error: "Events werden benötigt",
      invalid_type_error: "Events müssen ein Array sein",
    }
  ),
});

const renderEmergencyTagSchema = z.object({
  ...tagCore,
});

const renderNotConfiguredTagSchema = z.object({
  ...tagCore,
  url: z
    .string({
      required_error: "Sie müssen eine URL angeben",
      invalid_type_error: "Die URL ist ungültig",
    })
    .url("Die URL ist ungültig"),
});

export type RenderTagScheduleBody = z.infer<typeof renderTagScheduleSchema>;
export type RenderEmergencyTagBody = z.infer<typeof renderEmergencyTagSchema>;
export type RenderNotConfiguredTagBody = z.infer<
  typeof renderNotConfiguredTagSchema
>;

const models = {
  renderTagScheduleSchema,
  renderEmergencyTagSchema,
  renderNotConfiguredTagSchema,
};

export const { schemas: TagSchemas, $ref } = buildJsonSchemas(models, {
  $id: "TagSchema",
  errorMessages: true,
});
