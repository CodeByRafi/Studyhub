"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getUser } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";

export default function BlogDetailPage() {
  const [user, setUser] = useState<any>(null);
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  // Sample blog content - in production, this would come from an API
  const blogContent: Record<string, any> = {
    "effective-study-routine": {
      title: "How to Build an Effective Study Routine",
      author: "Ayesha Khan",
      date: "2026-04-01",
      readTime: "3 min read",
      category: "Study Tips",
      image: "📚",
      content: `
# Building an Effective Study Routine

Creating and maintaining an effective study routine is one of the most important factors in academic success. Whether you're preparing for exams, working on assignments, or simply trying to improve your understanding of course material, a well-structured study routine can make all the difference.

## 1. Set Clear Goals

Before you start studying, identify what you want to accomplish. Are you preparing for an exam? Working on a specific assignment? Trying to understand a difficult concept? Setting clear, specific goals will help you stay focused and measure your progress.

Some examples of good study goals:
- Complete Chapter 5 and understand photosynthesis concepts
- Solve 20 practice problems on derivatives
- Review notes from last week's lectures

## 2. Find Your Optimal Study Environment

Everyone has different preferences when it comes to their study space. Some people work best in libraries, while others prefer studying at home or in cafes. Experiment with different environments to find what works best for you.

Key factors to consider:
- **Noise level**: Do you need silence, or do you work better with background music?
- **Lighting**: Natural light vs. artificial light
- **Comfort**: Are you sitting at a desk or on a couch?
- **Distractions**: Can you minimize phone notifications and other interruptions?

## 3. Use the Pomodoro Technique

The Pomodoro Technique is a time management method that breaks work into focused 25-minute intervals separated by short 5-minute breaks. After four "pomodoros," take a longer 15-30 minute break.

This technique helps because:
- It creates a sense of urgency
- Regular breaks prevent burnout
- It's easier to stay focused for 25 minutes than several hours
- It builds momentum for longer study sessions

## 4. Create a Study Schedule

Consistency is key to developing an effective study routine. Try to study at the same time each day, if possible. This helps your brain prepare for focused work and makes studying feel like a natural part of your routine.

Sample weekly schedule:
- Monday-Friday: 2 hours after classes
- Saturday: 3-4 hours study time
- Sunday: Light review, 1-2 hours

## 5. Vary Your Study Methods

Don't just read your notes over and over. Use different techniques to keep your brain engaged and reinforce learning:

- **Active recall**: Test yourself without looking at notes
- **Spaced repetition**: Review material at increasing intervals
- **Teaching**: Explain concepts to others
- **Practice problems**: Apply knowledge to new situations
- **Mind mapping**: Visualize relationships between concepts

## 6. Take Care of Your Physical Health

Your body and mind are connected. To study effectively, you need to:
- Get 7-9 hours of sleep each night
- Exercise regularly
- Eat nutritious meals
- Stay hydrated

These factors significantly impact your focus, memory, and retention.

## Conclusion

Building an effective study routine takes time and experimentation. Don't be afraid to try different approaches and adjust based on what works best for you. Remember, consistency and quality matter more than quantity when it comes to studying.
      `,
      relatedPosts: ["research-papers-stand-out", "exam-preparation-guide"],
    },
    "research-papers-stand-out": {
      title: "Writing Research Papers That Stand Out",
      author: "Rafi Ahmed",
      date: "2026-03-28",
      readTime: "5 min read",
      category: "Academics",
      image: "🔬",
      content: `
# Writing Research Papers That Stand Out

Writing a research paper can seem daunting, but with the right approach and structure, you can create a compelling academic work that stands out to your professors.

## Understanding the Purpose

A research paper is more than just a summary of sources. It's an opportunity to:
- Demonstrate your understanding of a topic
- Show your ability to think critically
- Contribute original insights to the discussion
- Communicate your findings clearly and persuasively

## Structure Your Paper

### Title and Abstract
- Make your title specific and engaging
- Write a concise abstract (100-150 words) summarizing your research

### Introduction
- Hook your reader with an interesting question or statement
- Provide background context
- State your thesis clearly and specifically

### Literature Review
- Summarize existing research on your topic
- Identify gaps in current knowledge
- Explain how your research addresses these gaps

### Methodology
- Explain your research approach
- Describe your sources and data
- Justify your chosen methods

### Results and Discussion
- Present your findings clearly
- Analyze what your results mean
- Connect back to your thesis

### Conclusion
- Summarize your main points
- Discuss implications of your findings
- Suggest areas for future research

## Tips for Excellence

1. **Start Early**: Begin research weeks before the deadline
2. **Read Widely**: Consult multiple authoritative sources
3. **Take Good Notes**: Record source information for citations
4. **Write Multiple Drafts**: Revision is key to quality writing
5. **Use Proper Citations**: Follow your institution's style guide
6. **Proofread Carefully**: Errors detract from your credibility

## Citation Matters

Proper citation is crucial for academic integrity. Choose your citation style early and stick with it throughout your paper. Common styles include MLA, APA, and Chicago.

Remember: Citing sources isn't about admitting you used other people's ideas—it's about showing respect for scholarly work and building trust with your readers.

## Final Thoughts

Great research papers combine thorough research, clear writing, and original thinking. Focus on understanding your topic deeply, organizing your thoughts logically, and expressing your ideas clearly. Your professor will notice the difference.
      `,
      relatedPosts: ["effective-study-routine", "exam-preparation-guide"],
    },
  };

  const post = blogContent[slug] || {
    title: "Article Not Found",
    author: "Unknown",
    date: "Unknown",
    readTime: "Unknown",
    category: "Unknown",
    image: "❓",
    content: "This article could not be found.",
    relatedPosts: [],
  };

  const relatedPosts = post.relatedPosts.map((postSlug: string) => ({
    slug: postSlug,
    ...blogContent[postSlug] || {},
  }));

  const content = (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 text-sm"
        >
          <span>←</span>
          Back to Blog
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="text-5xl mb-6">{post.image}</div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
          <p className="text-xl text-white/70 mb-6">{post.content.split('\n')[1]}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 text-white/70 text-sm">
            <div>
              <span className="font-semibold text-white">{post.author}</span>
            </div>
            <div>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div>{post.readTime}</div>
            <div className="rounded-full bg-purple-500/20 px-3 py-1 text-purple-200">
              {post.category}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/10"></div>

        {/* Article Content */}
        <article className="prose prose-invert max-w-none mb-12">
          <div className="space-y-6 text-[#e4e4e7]">
            {post.content.split('\n\n').map((paragraph: string, idx: number) =>
              paragraph.trim() ? (
                <div key={idx} className="leading-relaxed">
                  {paragraph.startsWith('#') ? (
                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                      {paragraph.replace(/#\s+/, '')}
                    </h2>
                  ) : paragraph.startsWith('-') ? (
                    <ul className="space-y-2 ml-4">
                      {paragraph.split('\n').map((item: string, i: number) =>
                        item.startsWith('-') ? (
                          <li key={i} className="flex gap-2">
                            <span className="text-purple-400">•</span>
                            <span>{item.replace(/^-\s+/, '')}</span>
                          </li>
                        ) : null
                      )}
                    </ul>
                  ) : (
                    <p>{paragraph}</p>
                  )}
                </div>
              ) : null
            )}
          </div>
        </article>

        {/* Divider */}
        <div className="my-8 border-t border-white/10"></div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {relatedPosts.map((relatedPost: any) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                  <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:scale-105 h-full">
                    <div className="text-3xl mb-3">{relatedPost.image}</div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-purple-300 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-white/70 mb-4">By {relatedPost.author}</p>
                    <span className="text-xs text-purple-400 font-medium">{relatedPost.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Explore More Resources</h2>
          <p className="text-white/70 mb-6">
            Ready to boost your learning? Check out our AI tools and study materials.
          </p>
          <Link
            href="/features"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white hover:opacity-90 transition-all"
          >
            Visit AI Tools
            <span>→</span>
          </Link>
        </div>
      </main>
    </div>
  );

  if (user) {
    return <AppLayout>{content}</AppLayout>;
  }
  return content;
}
