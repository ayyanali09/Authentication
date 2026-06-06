import { BlogPostModel } from "../models/BlogPost.js";
import { ContactMessageModel } from "../models/ContactMessage.js";
import { ProjectModel } from "../models/Project.js";
import { TestimonialModel } from "../models/Testimonial.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/http.js";

export const getAnalyticsOverview = asyncHandler(async (_req, res) => {
  const [
    projectCount,
    publishedPostCount,
    testimonialCount,
    newInquiryCount,
    recentInquiries
  ] = await Promise.all([
    ProjectModel.countDocuments(),
    BlogPostModel.countDocuments({ status: "published" }),
    TestimonialModel.countDocuments(),
    ContactMessageModel.countDocuments({ status: "new" }),
    ContactMessageModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email service budget status createdAt")
      .lean()
  ]);

  return sendSuccess(res, {
    cards: [
      { label: "Projects", value: projectCount, trend: "+18%" },
      { label: "Published Posts", value: publishedPostCount, trend: "+9%" },
      { label: "Testimonials", value: testimonialCount, trend: "+12%" },
      { label: "New Inquiries", value: newInquiryCount, trend: "+24%" }
    ],
    funnel: [
      { label: "Site Visits", value: 84200 },
      { label: "Qualified Leads", value: 1380 },
      { label: "Strategy Calls", value: 214 },
      { label: "Won Deals", value: 41 }
    ],
    recentInquiries
  });
});
