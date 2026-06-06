import { BlogPostModel } from "../models/BlogPost.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError, sendSuccess } from "../utils/http.js";
import { slugify } from "../utils/slugify.js";

async function createUniquePostSlug(source: string) {
  const baseSlug = slugify(source);
  const exists = await BlogPostModel.exists({ slug: baseSlug });
  return exists ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;
}

export const listBlogPosts = asyncHandler(async (_req, res) => {
  const posts = await BlogPostModel.find({ status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  return sendSuccess(res, posts);
});

export const listBlogPostsForAdmin = asyncHandler(async (_req, res) => {
  const posts = await BlogPostModel.find().sort({ createdAt: -1 }).lean();
  return sendSuccess(res, posts);
});

export const getBlogPostBySlug = asyncHandler(async (req, res) => {
  const post = await BlogPostModel.findOne({
    slug: req.params.slug,
    status: "published"
  }).lean();

  if (!post) {
    throw new HttpError(404, "Blog post not found");
  }

  return sendSuccess(res, post);
});

export const createBlogPost = asyncHandler(async (req, res) => {
  const body = req.body;
  const post = await BlogPostModel.create({
    ...body,
    slug: await createUniquePostSlug(body.slug ?? body.title),
    publishedAt:
      body.status === "published" ? body.publishedAt ?? new Date() : body.publishedAt
  });

  return sendSuccess(res, post, 201, "Blog post created");
});

export const updateBlogPost = asyncHandler(async (req, res) => {
  const body = { ...req.body };

  if (body.slug || body.title) {
    body.slug = await createUniquePostSlug(body.slug ?? body.title);
  }

  if (body.status === "published" && !body.publishedAt) {
    body.publishedAt = new Date();
  }

  const post = await BlogPostModel.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true
  });

  if (!post) {
    throw new HttpError(404, "Blog post not found");
  }

  return sendSuccess(res, post, 200, "Blog post updated");
});

export const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPostModel.findByIdAndDelete(req.params.id);

  if (!post) {
    throw new HttpError(404, "Blog post not found");
  }

  return sendSuccess(res, { id: req.params.id }, 200, "Blog post deleted");
});
