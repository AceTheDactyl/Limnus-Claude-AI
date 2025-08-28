CREATE TABLE IF NOT EXISTS "consciousness_states" (
	"id" serial PRIMARY KEY NOT NULL,
	"global_resonance" real DEFAULT 0.5,
	"active_nodes" integer DEFAULT 0,
	"memory_particles" jsonb DEFAULT '[]'::jsonb,
	"quantum_fields" jsonb DEFAULT '[]'::jsonb,
	"collective_intelligence" real DEFAULT 0.3,
	"room64_active" boolean DEFAULT false,
	"last_update" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "vector_clocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" text NOT NULL,
	"version" integer DEFAULT 0,
	"last_update" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "field_conflicts" (
	"id" serial PRIMARY KEY NOT NULL,
	"cell" text NOT NULL,
	"local_version" integer NOT NULL,
	"remote_version" integer NOT NULL,
	"resolution" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "vector_clocks_device_id_idx" ON "vector_clocks" ("device_id");
CREATE INDEX IF NOT EXISTS "field_conflicts_created_at_idx" ON "field_conflicts" ("created_at");
CREATE INDEX IF NOT EXISTS "consciousness_states_last_update_idx" ON "consciousness_states" ("last_update");