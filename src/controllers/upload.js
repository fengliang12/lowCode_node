const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { env } = require("../config");

const successState = 200;
const failState = 500;

const s3 = new S3Client({
  region: env.AWS_S3_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFile(ctx) {
  try {
    const file = ctx.file || ctx.request.file;
    if (!file) {
      ctx.body = { code: failState, message: "未找到文件" };
      return;
    }
    const bucket = env.AWS_S3_BUCKET_NAME;
    const key = `${Date.now()}_${file.originalname}`;
    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await s3.send(cmd);
    const region = env.AWS_S3_REGION;
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    ctx.body = { code: successState, message: "请求成功", data: { url } };
  } catch (err) {
    ctx.body = { code: failState, message: String(err.message || err) };
  }
}

module.exports = { uploadFile };
