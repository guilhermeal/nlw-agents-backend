import { reset, seed } from "drizzle-seed";
import { db, sql } from "./connection.ts";
import { schema } from "./schema/index.ts";

await reset(db, schema);

await seed(db, schema).refine((f) => {
  return {
    rooms: {
      count: 20,
      columns: {
        name: f.companyName(),
        description: f.loremIpsum(),
      },
      // DESSA FORMA, SERÁ CRIADO 5 QUESTOES PARA CADA ROOM (SALA)
      // with: {
      //   questions: 5,
      // },
    },
    questions: {
      count: 15,
    }
  };
});

await sql.end();
