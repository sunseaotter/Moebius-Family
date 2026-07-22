-- AlterTable: add "Also Known As"
ALTER TABLE "User" ADD COLUMN     "alsoKnownAs" TEXT;

-- AlterTable: personalWebsite becomes a fixed-size array (existing single
-- values are preserved as a one-element array).
ALTER TABLE "User" ALTER COLUMN "personalWebsite" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "personalWebsite" TYPE TEXT[] USING (
  CASE
    WHEN "personalWebsite" IS NULL OR "personalWebsite" = '' THEN ARRAY[]::TEXT[]
    ELSE ARRAY["personalWebsite"]
  END
);
ALTER TABLE "User" ALTER COLUMN "personalWebsite" SET DEFAULT ARRAY[]::TEXT[];
