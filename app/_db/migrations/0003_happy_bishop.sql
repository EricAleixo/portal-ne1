ALTER TABLE "posts" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "photo_url" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "tags" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "updated_at" timestamp DEFAULT now();