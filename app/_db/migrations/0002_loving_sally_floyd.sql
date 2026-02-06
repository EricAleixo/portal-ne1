CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_color_unique" UNIQUE("color")
);
--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "publishedAt" TO "published_at";--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "category_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;