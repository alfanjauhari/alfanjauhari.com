export const articles = [
  {
    id: "1",
    title: "The Beauty of Minimalist Interfaces",
    date: "Oct 12, 2024",
    category: "Design",
    summary:
      "Exploring why less is often more when constructing user interfaces for complex applications. We dive into negative space, typography scales, and the removal of non-essential elements.",
    readTime: "5 min",
    featured: true,
    content: `
      <p class="mb-6 text-xl font-serif leading-relaxed text-gray-800 dark:text-gray-200">In a world cluttered with information, clarity is power. Minimalist interfaces are not about removing features; they are about removing distractions. When we strip away the non-essential, we allow the user to focus on what truly matters.</p>

      <h3 class="text-2xl font-bold mt-12 mb-6">The Power of Negative Space</h3>
      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">The concept of negative space—often referred to as whitespace—is fundamental to this approach. It is not merely empty space; it is an active design element that guides the eye and creates structure without the need for borders or dividers. By increasing the margins and padding between elements, we create a rhythm that makes the content easier to digest.</p>

      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">Consider the evolution of typography on the web. We have moved from dense, text-heavy pages to layouts that breathe. Large, bold headings paired with generous line heights improve readability and reduce cognitive load. This is not just an aesthetic choice; it is a functional one.</p>

      <h3 class="text-2xl font-bold mt-12 mb-6">Function Over Decoration</h3>
      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">As frontend engineers, we must advocate for simplicity. Every element we add to a page increases complexity, maintenance cost, and cognitive burden on the user. Before adding a button, a modal, or a tooltip, ask yourself: "Is this absolutely necessary?"</p>

      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">True minimalism is the result of rigorous editing. It is the art of saying more with less. It requires a deep understanding of the user's goals and the discipline to prioritize them above all else.</p>
    `,
  },
  {
    id: "2",
    title: "React 19 and the Future of State",
    date: "Sep 28, 2024",
    category: "Engineering",
    summary:
      "A deep dive into the new features of React 19 and how they change our mental model of state management.",
    readTime: "8 min",
    featured: true,
    content: `
      <p class="mb-6 text-xl font-serif leading-relaxed text-gray-800 dark:text-gray-200">React has always been about the UI being a function of state. With React 19, that function is becoming more powerful, more concurrent, and surprisingly, simpler.</p>

      <h3 class="text-2xl font-bold mt-12 mb-6">The Death of useEffect?</h3>
      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">For years, <code>useEffect</code> has been the swiss-army knife of React development. Fetching data? useEffect. Subscribing to events? useEffect. Synchronizing state? useEffect. But it was also a footgun. React 19 introduces new primitives that handle these side effects more gracefully, moving us towards a model where valid state transitions are handled directly in event handlers or through the new <code>use</code> API.</p>

      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">The introduction of the compiler also means we spend less time worrying about memoization. <code>useMemo</code> and <code>useCallback</code> might soon become relics of a manual optimization era, allowing us to focus purely on business logic.</p>
    `,
  },
  {
    id: "3",
    title: "Typography in the Age of AI",
    date: "Aug 15, 2024",
    category: "Thoughts",
    summary:
      "Can AI truly understand the nuance of kerning and leading? A look at generative design tools.",
    readTime: "4 min",
    featured: false,
    content: `
      <p class="mb-6 text-xl font-serif leading-relaxed text-gray-800 dark:text-gray-200">Generative AI can write code, paint pictures, and compose music. But can it typeset a page?</p>
      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">Typography is an emotional discipline. The difference between a good layout and a great one often comes down to "feeling"—the subtle adjustment of tracking on a headline, the optical alignment of a bullet point. These are decisions made by the human eye, influenced by centuries of tradition.</p>
    `,
  },
  {
    id: "4",
    title: "Building Resilient Systems",
    date: "Jul 02, 2024",
    category: "Engineering",
    summary:
      "Strategies for error handling and gracefull degradation in modern web apps.",
    readTime: "6 min",
    featured: false,
    content: `
      <p class="mb-6 text-xl font-serif leading-relaxed text-gray-800 dark:text-gray-200">Errors are inevitable. Broken systems are optional.</p>
      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">Resilience in frontend development means assuming the network will fail, the API will return 500s, and the user will click buttons twice. It means designing UI states that communicate uncertainty without breaking trust.</p>
    `,
  },
  {
    id: "5",
    title: "The Psychology of Loading States",
    date: "Jun 10, 2024",
    category: "UX",
    summary:
      "How perceived performance affects user retention and the subtle art of skeleton screens.",
    readTime: "5 min",
    featured: true,
    content: `
      <p class="mb-6 text-xl font-serif leading-relaxed text-gray-800 dark:text-gray-200">Waiting is painful. But waiting without feedback is torture.</p>
      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">Skeleton screens work because they reduce entropy. They provide a structure that promises content is coming, maintaining the layout stability and reducing the cognitive jar when data finally arrives. It's a small psychological trick that makes 2 seconds feel like 500ms.</p>
    `,
  },
];
