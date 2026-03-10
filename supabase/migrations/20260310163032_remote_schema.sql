


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."account_balance_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "balance" numeric(19,2) DEFAULT '0'::numeric NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "exchange_rate" numeric(10,6) DEFAULT 1.0 NOT NULL
);


ALTER TABLE "public"."account_balance_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying NOT NULL,
    "type" character varying NOT NULL,
    "bank" character varying NOT NULL,
    "currency" character(3) NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL
);


ALTER TABLE "public"."accounts" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."accounts_with_current_balance" WITH ("security_invoker"='on') AS
 SELECT "a"."id",
    "a"."name",
    "a"."type",
    "a"."bank",
    "a"."currency",
    "a"."user_id",
    COALESCE("b"."balance", (0)::numeric) AS "balance"
   FROM ("public"."accounts" "a"
     LEFT JOIN LATERAL ( SELECT "h"."balance"
           FROM "public"."account_balance_history" "h"
          WHERE ("h"."account_id" = "a"."id")
          ORDER BY "h"."created_at" DESC
         LIMIT 1) "b" ON (true));


ALTER VIEW "public"."accounts_with_current_balance" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."monthly_total_balance" WITH ("security_invoker"='on') AS
 WITH "monthly_last_balance" AS (
         SELECT DISTINCT ON ("abh"."account_id", ("date_trunc"('month'::"text", "abh"."created_at"))) "abh"."account_id",
            "date_trunc"('month'::"text", "abh"."created_at") AS "month",
            "abh"."balance",
            "abh"."exchange_rate",
            "abh"."created_at"
           FROM "public"."account_balance_history" "abh"
          ORDER BY "abh"."account_id", ("date_trunc"('month'::"text", "abh"."created_at")), "abh"."created_at" DESC
        )
 SELECT "month",
    "sum"(("balance" * "exchange_rate")) AS "total_balance"
   FROM "monthly_last_balance"
  GROUP BY "month"
  ORDER BY "month";


ALTER VIEW "public"."monthly_total_balance" OWNER TO "postgres";


ALTER TABLE ONLY "public"."account_balance_history"
    ADD CONSTRAINT "account_balance_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."account_balance_history"
    ADD CONSTRAINT "account_balance_history_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id");



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Users can delete own accounts" ON "public"."accounts" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own balance history" ON "public"."account_balance_history" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."accounts"
  WHERE (("accounts"."id" = "account_balance_history"."account_id") AND ("accounts"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can insert own accounts" ON "public"."accounts" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own balance history" ON "public"."account_balance_history" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."accounts"
  WHERE (("accounts"."id" = "account_balance_history"."account_id") AND ("accounts"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update own accounts" ON "public"."accounts" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own accounts" ON "public"."accounts" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own balance history" ON "public"."account_balance_history" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."accounts"
  WHERE (("accounts"."id" = "account_balance_history"."account_id") AND ("accounts"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."account_balance_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."accounts" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."account_balance_history" TO "anon";
GRANT ALL ON TABLE "public"."account_balance_history" TO "authenticated";
GRANT ALL ON TABLE "public"."account_balance_history" TO "service_role";



GRANT ALL ON TABLE "public"."accounts" TO "anon";
GRANT ALL ON TABLE "public"."accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."accounts" TO "service_role";



GRANT ALL ON TABLE "public"."accounts_with_current_balance" TO "anon";
GRANT ALL ON TABLE "public"."accounts_with_current_balance" TO "authenticated";
GRANT ALL ON TABLE "public"."accounts_with_current_balance" TO "service_role";



GRANT ALL ON TABLE "public"."monthly_total_balance" TO "anon";
GRANT ALL ON TABLE "public"."monthly_total_balance" TO "authenticated";
GRANT ALL ON TABLE "public"."monthly_total_balance" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


