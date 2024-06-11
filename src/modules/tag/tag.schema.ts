import { buildJsonSchemas } from "fastify-zod";
import z from "zod";

const renderTagScheduleSchema = z.object({
  name: z.string({
    required_error: "Name wird benötigt",
    invalid_type_error: "Name muss ein String sein",
  }),
  date: z.string({
    required_error: "Datum wird benötigt",
    invalid_type_error: "Datum muss ein String sein",
  }),
  height: z.coerce.number(
    z
      .string({
        required_error: "Höhe wird benötigt",
        invalid_type_error: "Höhe muss eine Zahl sein",
      })
      .min(1, "Höhe muss eine positive Zahl größer 0 sein")
  ),
  width: z.coerce.number(
    z
      .string({
        required_error: "Breite wird benötigt",
        invalid_type_error: "Breite muss eine Zahl sein",
      })
      .min(1, "Breite muss eine positive Zahl größer 0 sein")
  ),
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

export type RenderTagScheduleBody = z.infer<typeof renderTagScheduleSchema>;

const models = {
  renderTagScheduleSchema,
};

export const { schemas: TagSchemas, $ref } = buildJsonSchemas(models, {
  $id: "TagSchema",
});
