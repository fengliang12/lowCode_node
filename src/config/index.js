const { cleanEnv, str, port, url, num } = require("envalid");
require("dotenv").config();

const env = cleanEnv(process.env, {
  PORT: port({ default: 8101 }),
  DATABASE_URL: str({ default: "" }),
  DB_HOST: str({ default: "" }),
  DB_PORT: num({ default: 5432 }),
  DB_USERNAME: str({ default: "" }),
  DB_PASSWORD: str({ default: "" }),
  DB_DATABASE: str({ default: "" }),
  SUPABASE_URL: url({ default: "https://example.supabase.co" }),
  SUPABASE_ANON_KEY: str({ default: "" }),
  JWT_SECRET: str({ default: "jwt-secret" }),
  AWS_ACCESS_KEY_ID: str({ default: "" }),
  AWS_SECRET_ACCESS_KEY: str({ default: "" }),
  AWS_S3_BUCKET_NAME: str({ default: "" }),
  AWS_S3_REGION: str({ default: "us-east-1" }),
  HTTPS_PROXY: str({ default: "" }),
  NO_PROXY: str({
    default:
      "localhost,127.0.0.1,amazonaws.com,s3.amazonaws.com,s3.us-east-1.amazonaws.com,api.weixin.qq.com,supabase.com,pooler.supabase.com",
  }),
  WX_APP_ID: str({ default: "" }),
  WX_APP_SECRET: str({ default: "" }),
});

const isDbEnabled = !!(
  env.DATABASE_URL ||
  (env.DB_HOST && env.DB_USERNAME && env.DB_DATABASE)
);
const isS3Enabled = !!(
  env.AWS_ACCESS_KEY_ID &&
  env.AWS_SECRET_ACCESS_KEY &&
  env.AWS_S3_BUCKET_NAME
);

module.exports = { env, isDbEnabled, isS3Enabled };
