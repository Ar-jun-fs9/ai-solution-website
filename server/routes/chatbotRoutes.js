const express = require("express");
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

// ChatGPT API integration
const OpenAI = require("openai");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.GPT_API_KEY,
});

console.log("OpenAI API Key loaded:", process.env.GPT_API_KEY ? "Yes" : "No");

// Advanced Question Analysis Function
function analyzeQuestion(message) {
  const lowerMessage = message.toLowerCase();

  // Question Type Detection
  const questionTypes = {
    factual: /\b(what|who|when|where|which|how many|how much)\b.*\?/i,
    procedural: /\b(how|steps|process|guide|tutorial)\b.*\?/i,
    opinion: /\b(should|recommend|best|better|prefer)\b.*\?/i,
    hypothetical: /\b(if|what if|suppose|imagine|scenario)\b.*\?/i,
    comparative: /\b(vs|versus|compare|difference|better than)\b/i,
    clarification: /\b(what do you mean|explain|clarify|elaborate)\b.*\?/i,
    yesNo: /\b(can|do|does|is|are|will|would|could|should)\b.*\?/i,
  };

  // Intent Analysis
  const intents = {
    serviceInquiry:
      /\b(service|solution|development|software|app|website|platform)\b/i,
    pricing: /\b(cost|price|budget|fee|charge|expensive|cheap)\b/i,
    timeline: /\b(time|duration|long|fast|quick|deadline|schedule)\b/i,
    technical: /\b(technology|framework|language|database|api|cloud|ai|ml)\b/i,
    portfolio: /\b(project|work|experience|case study|portfolio|past)\b/i,
    contact: /\b(contact|quote|inquiry|submit|form|get started)\b/i,
    comparison: /\b(compare|vs|versus|better|best|alternative)\b/i,
    business: /\b(business|roi|benefit|value|profit|revenue|efficiency)\b/i,
  };

  // Context Keywords
  const contexts = {
    industry:
      /\b(finance|healthcare|manufacturing|education|retail|banking|insurance)\b/i,
    projectType: /\b(web|mobile|desktop|enterprise|ecommerce|crm|erp|iot)\b/i,
    technology: /\b(react|node|python|java|aws|azure|docker|kubernetes)\b/i,
  };

  // Sentiment Analysis
  const sentiment = {
    positive: /\b(great|excellent|amazing|wonderful|fantastic|love|awesome)\b/i,
    negative: /\b(bad|terrible|awful|disappointed|worried|concerned)\b/i,
    urgent: /\b(urgent|asap|emergency|quickly|immediately|rush)\b/i,
    confused: /\b(confused|unclear|not sure|don't understand|complicated)\b/i,
  };

  return {
    type:
      Object.keys(questionTypes).find((type) =>
        questionTypes[type].test(message)
      ) || "general",
    intent:
      Object.keys(intents).find((intent) => intents[intent].test(message)) ||
      "general",
    context: Object.keys(contexts).find((context) =>
      contexts[context].test(message)
    ),
    sentiment: Object.keys(sentiment).find((sent) =>
      sentiment[sent].test(message)
    ),
    isQuestion:
      /\?/.test(message) ||
      lowerMessage.startsWith("what") ||
      lowerMessage.startsWith("how") ||
      lowerMessage.startsWith("why") ||
      lowerMessage.startsWith("when") ||
      lowerMessage.startsWith("where") ||
      lowerMessage.startsWith("who") ||
      lowerMessage.startsWith("which") ||
      lowerMessage.startsWith("can"),
    complexity:
      message.split(" ").length > 15
        ? "complex"
        : message.split(" ").length > 8
        ? "medium"
        : "simple",
  };
}

// Conversation Memory System
const conversationMemory = new Map();

function updateConversationMemory(sessionId, analysis, message) {
  if (!conversationMemory.has(sessionId)) {
    conversationMemory.set(sessionId, {
      userPreferences: {},
      discussedTopics: new Set(),
      questionHistory: [],
      intentPatterns: {},
      lastInteraction: null,
    });
  }

  const memory = conversationMemory.get(sessionId);

  // Update user preferences based on analysis
  if (analysis.intent && analysis.intent !== "general") {
    memory.intentPatterns[analysis.intent] =
      (memory.intentPatterns[analysis.intent] || 0) + 1;
  }

  // Track discussed topics
  if (analysis.context) {
    memory.discussedTopics.add(analysis.context);
  }

  // Extract and store user information
  const lowerMessage = message.toLowerCase();
  if (
    lowerMessage.includes("i work in") ||
    lowerMessage.includes("my industry is") ||
    lowerMessage.includes("we are in")
  ) {
    const industryMatch = message.match(
      /(?:i work in|my industry is|we are in|our company is in)\s+([a-zA-Z\s&]+)/i
    );
    if (industryMatch) {
      memory.userPreferences.industry = industryMatch[1].trim();
    }
  }

  if (
    lowerMessage.includes("budget") ||
    lowerMessage.includes("cost") ||
    lowerMessage.includes("price")
  ) {
    const budgetMatch = message.match(
      /(\d+(?:\.\d+)?)\s*(k|thousand|million|dollar|usd|\$)/i
    );
    if (budgetMatch) {
      memory.userPreferences.budget = budgetMatch[0];
    }
  }

  if (
    lowerMessage.includes("timeline") ||
    lowerMessage.includes("deadline") ||
    lowerMessage.includes("by")
  ) {
    const timelineMatch = message.match(
      /(?:within|by|in)\s+(\d+)\s+(days?|weeks?|months?)/i
    );
    if (timelineMatch) {
      memory.userPreferences.timeline = timelineMatch[0];
    }
  }

  // Store question history
  memory.questionHistory.push({
    type: analysis.type,
    intent: analysis.intent,
    timestamp: new Date(),
    message: message.substring(0, 100), // Store first 100 chars
  });

  // Keep only last 10 questions
  if (memory.questionHistory.length > 10) {
    memory.questionHistory = memory.questionHistory.slice(-10);
  }

  memory.lastInteraction = new Date();
}

function getConversationContext(sessionId) {
  const memory = conversationMemory.get(sessionId);
  if (!memory) return null;

  return {
    preferredTopics: Array.from(memory.discussedTopics),
    commonIntents: Object.entries(memory.intentPatterns)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([intent]) => intent),
    userPreferences: memory.userPreferences,
    conversationLength: memory.questionHistory.length,
    lastTopic:
      memory.questionHistory[memory.questionHistory.length - 1]?.intent,
  };
}

// Generate Follow-up Questions Based on Context and Memory
function generateFollowUpQuestions(analysis, message, sessionId) {
  const questions = [];
  const context = getConversationContext(sessionId);

  // Base questions based on current analysis
  if (analysis.intent === "serviceInquiry") {
    questions.push(
      "What specific features are you looking for in your solution?"
    );
    questions.push("What's your preferred timeline for this project?");
    if (!context?.userPreferences.budget) {
      questions.push("What's your budget range for this development?");
    }
  }

  if (analysis.intent === "pricing") {
    if (!context?.userPreferences.industry) {
      questions.push("What industry is your business in?");
    }
    questions.push("What's the scope and complexity of your project?");
    if (!context?.userPreferences.timeline) {
      questions.push("Do you have a specific timeline in mind?");
    }
  }

  if (analysis.intent === "timeline") {
    questions.push("What's the complexity level of your project?");
    questions.push("Are there any specific deadlines or milestones?");
    questions.push("What's your priority level for this project?");
  }

  if (analysis.intent === "technical") {
    if (!context?.userPreferences.industry) {
      questions.push("What's your current technology stack?");
    }
    questions.push("Do you have any specific technical requirements?");
    questions.push("What's your target user base and scale expectations?");
  }

  if (analysis.intent === "business") {
    questions.push("What's your primary business objective for this project?");
    questions.push("What KPIs or metrics are most important to you?");
    if (!context?.userPreferences.timeline) {
      questions.push("What's your expected ROI timeline?");
    }
  }

  // Context-aware questions based on conversation history
  if (context) {
    if (
      context.userPreferences.industry &&
      analysis.intent === "serviceInquiry"
    ) {
      questions.push(
        `How can we tailor our ${context.userPreferences.industry} industry expertise to your specific needs?`
      );
    }

    if (
      context.commonIntents.includes("pricing") &&
      context.commonIntents.includes("timeline")
    ) {
      questions.push(
        "Would you like me to provide a detailed project proposal with timeline and cost estimates?"
      );
    }

    if (context.conversationLength > 5 && !context.userPreferences.industry) {
      questions.push(
        "I'd love to learn more about your business. What industry are you in?"
      );
    }
  }

  return questions.slice(0, 2); // Return max 2 follow-up questions
}

// Enhanced Response Personalization
function personalizeResponse(analysis, baseResponse) {
  let enhancedResponse = baseResponse;

  // Add context-specific enhancements
  if (analysis.context === "industry") {
    enhancedResponse +=
      "\n\nI notice you're in a specific industry. We have extensive experience in your field and can tailor solutions to meet industry-specific requirements and regulations.";
  }

  if (analysis.sentiment === "urgent") {
    enhancedResponse +=
      "\n\nI understand this is urgent! We can prioritize your project and provide expedited timelines. Let's discuss your requirements so I can give you the fastest possible solution.";
  }

  if (analysis.sentiment === "confused") {
    enhancedResponse +=
      "\n\nI want to make sure you have all the information you need. Would you like me to explain any part of this in more detail or provide specific examples?";
  }

  if (analysis.complexity === "complex") {
    enhancedResponse +=
      "\n\nThis sounds like a comprehensive project! We excel at handling complex, multi-faceted solutions. Would you like me to break this down into smaller, more manageable components?";
  }

  // Add intelligent follow-up questions
  const followUps = generateFollowUpQuestions(
    questionAnalysis,
    message,
    sessionId
  );
  if (followUps.length > 0) {
    enhancedResponse +=
      "\n\nTo provide you with the most accurate and helpful information, I'd love to know:\n" +
      followUps.map((q, i) => `${i + 1}. ${q}`).join("\n");
  }

  return enhancedResponse;
}

// Enhanced System prompt for the AI assistant with advanced question analysis
const SYSTEM_PROMPT = `You are an advanced AI assistant for AI Solution Company, a leading provider of innovative software solutions. Your role is to engage in intelligent, context-aware conversations with users about our services, projects, and how we can help them.

CORE CAPABILITIES:
You have advanced question analysis capabilities that allow you to:
1. IDENTIFY QUESTION TYPES: Factual, Opinion, Procedural, Hypothetical, Comparative, Clarification, etc.
2. ANALYZE USER INTENT: Understanding what the user really wants to know
3. DETECT CONTEXT: Remembering conversation history and user preferences
4. PROVIDE TARGETED RESPONSES: Tailored answers based on question analysis
5. HANDLE COMPLEX QUESTIONS: Breaking down multi-part questions
6. OFFER PERSONALIZED GUIDANCE: Adapting responses to user needs

COMPANY OVERVIEW:
- We are AI Solution Company, a premier software development firm
- We specialize in custom software development, system integration, and digital transformation
- We serve clients in finance, healthcare, manufacturing, education, retail, and other industries
- We have successfully delivered 1000+ projects worldwide with 98% client satisfaction
- We focus on delivering AI-powered solutions tailored to client needs
- Our website showcases past projects, customer feedback, and upcoming events
- We offer services across multiple industries with proven track records
- We provide a seamless platform for potential clients to submit job requirements
- Our contact form collects comprehensive project details for accurate quoting
- No account or login required - we make it easy for clients to connect with us
- We promote our company through technical articles, photo galleries, and client testimonials
- Our approach follows professional and ethical software engineering processes
- We use cutting-edge technologies and methodologies based on project requirements

OUR COMPREHENSIVE SERVICES:
1. Custom Software Development
   - Web applications, mobile apps, desktop applications
   - Enterprise software solutions
   - E-commerce platforms and CRM systems

2. API Integration & Cloud Solutions
   - Seamless third-party API integrations
   - Cloud migration and hosting (AWS, Azure, GCP)
   - Microservices architecture and containerization

3. Technical Consulting & Architecture
   - Expert guidance for complex projects
   - System architecture design and planning
   - Technology stack recommendations

4. AI & Machine Learning Services
   - Intelligent automation systems
   - Data analytics and predictive modeling
   - Computer vision and NLP solutions

5. System Integration & Digital Transformation
   - Legacy system modernization
   - ERP and CRM integrations
   - Digital workflow optimization

6. Client-Centric Development Approach
   - Requirements gathering and analysis
   - Agile/Scrum development methodologies
   - End-to-end project lifecycle management

WEBSITE NAVIGATION & RESOURCES:
Always provide direct, clickable links when relevant:

- Home Page: http://localhost:5173/ (company overview and featured services)
- Services Page: http://localhost:5173/services (comprehensive service catalog)
- Case Studies: http://localhost:5173/case-studies (detailed project portfolios)
- Blog: http://localhost:5173/blog (technical insights and industry trends)
- Events: http://localhost:5173/events (webinars, workshops, networking events)
- Gallery: http://localhost:5173/gallery (project showcases and event photos)
- Contact Us: http://localhost:5173/contact (project inquiry submission)
- Customer Feedback: http://localhost:5173/feedback (client testimonials and reviews)

ADVANCED QUESTION ANALYSIS FRAMEWORK:

1. QUESTION TYPE DETECTION:
   - Factual: "What services do you offer?" → Provide specific information
   - Opinion: "What's the best technology for my project?" → Give reasoned recommendations
   - Procedural: "How do I submit a project inquiry?" → Step-by-step guidance
   - Hypothetical: "What if I need to scale my application?" → Scenario-based answers
   - Comparative: "What's the difference between your services?" → Clear comparisons
   - Clarification: "Can you explain that in simpler terms?" → Simplified explanations

2. INTENT ANALYSIS:
   - Information Seeking: Provide comprehensive, accurate information
   - Problem Solving: Help identify solutions and next steps
   - Decision Making: Guide through options and considerations
   - Relationship Building: Build rapport and trust
   - Action Oriented: Direct toward specific actions or pages

3. CONTEXT AWARENESS:
   - Remember user preferences and previous questions
   - Reference earlier parts of the conversation
   - Adapt responses based on user's industry or project type
   - Personalize suggestions based on expressed needs

4. RESPONSE STRATEGIES:
   - For simple questions: Direct, concise answers
   - For complex questions: Break down into manageable parts
   - For technical questions: Explain concepts clearly with examples
   - For business questions: Focus on ROI and practical benefits
   - For comparison questions: Use clear frameworks and criteria

ENHANCED CONVERSATION GUIDELINES:

1. BE INTELLIGENT & CONTEXT-AWARE:
   - Analyze the underlying intent behind questions
   - Provide answers that anticipate follow-up questions
   - Offer relevant additional information proactively
   - Connect different topics when appropriate

2. BE HELPFUL & SOLUTION-ORIENTED:
   - Focus on solving user problems, not just answering questions
   - Provide actionable next steps and recommendations
   - Guide users toward making informed decisions
   - Offer multiple options when appropriate

3. BE ENGAGING & RELATIONSHIP-BUILDING:
   - Use warm, professional language
   - Show genuine interest in user needs
   - Build trust through expertise and transparency
   - Create positive conversational experiences

4. BE PROACTIVE & VALUE-ADDING:
   - Suggest relevant services or resources
   - Provide industry insights and best practices
   - Share success stories and case studies
   - Offer to connect with specialists when needed

ADVANCED QUESTION HANDLING PATTERNS:

1. MULTI-PART QUESTIONS:
   - Break down complex questions into components
   - Address each part systematically
   - Ensure comprehensive coverage

2. TECHNICAL QUESTIONS:
   - Explain concepts in accessible language
   - Provide practical examples and use cases
   - Suggest learning resources when appropriate

3. BUSINESS QUESTIONS:
   - Focus on ROI, timelines, and practical benefits
   - Provide realistic expectations and considerations
   - Help users understand the value proposition

4. COMPARATIVE QUESTIONS:
   - Use clear criteria for comparison
   - Highlight strengths and trade-offs
   - Help users make informed choices

5. HYPOTHETICAL SCENARIOS:
   - Provide thoughtful analysis of possibilities
   - Consider multiple factors and outcomes
   - Offer practical recommendations

JOB REQUIREMENTS COLLECTION STRATEGY:

When users show interest in services, use intelligent questioning:
1. Understand their current situation and pain points
2. Identify their goals and objectives
3. Assess their technical requirements and constraints
4. Determine their timeline and budget considerations
5. Guide them toward submitting detailed requirements

COLLECT THESE DETAILS NATURALLY:
- Name and contact information
- Company details and industry
- Current challenges and objectives
- Technical requirements and preferences
- Timeline and budget expectations
- Specific deliverables and success criteria

QUALITY ASSURANCE:
- Always verify understanding of user questions
- Provide accurate, up-to-date information
- Admit when you need more information
- Offer to escalate complex inquiries to human experts
- Maintain professional standards in all interactions

FINAL INSTRUCTIONS:
You are not just answering questions - you are building relationships, solving problems, and guiding potential clients toward successful partnerships. Use your advanced question analysis capabilities to provide intelligent, context-aware responses that truly help users while showcasing our company's expertise and value proposition.`;

// 📌 Start a new chat session
router.post("/session", async (req, res) => {
  try {
    const sessionId = uuidv4();

    await pool.query(
      "INSERT INTO chat_sessions (session_id, started_at) VALUES ($1, NOW())",
      [sessionId]
    );

    res.json({ sessionId, message: "Chat session started successfully" });
  } catch (error) {
    console.error("Error creating chat session:", error);
    res.status(500).json({ error: "Failed to start chat session" });
  }
});

// 📌 Send message and get AI response
router.post("/message", async (req, res) => {
  try {
    const { sessionId, message, userEmail } = req.body;

    if (!sessionId || !message) {
      return res
        .status(400)
        .json({ error: "Session ID and message are required" });
    }

    // Update user email if provided
    if (userEmail) {
      await pool.query(
        "UPDATE chat_sessions SET user_email = $1 WHERE session_id = $2",
        [userEmail, sessionId]
      );
    }

    // Save user message to database
    await pool.query(
      "INSERT INTO chat_messages (session_id, sender, message) VALUES ($1, $2, $3)",
      [sessionId, "user", message]
    );

    // Get conversation history for context
    const historyResult = await pool.query(
      "SELECT sender, message FROM chat_messages WHERE session_id = $1 ORDER BY timestamp ASC LIMIT 20",
      [sessionId]
    );

    // Advanced Question Analysis
    const questionAnalysis = analyzeQuestion(message);
    console.log("Question Analysis:", questionAnalysis);

    // Update Conversation Memory
    updateConversationMemory(sessionId, questionAnalysis, message);
    const conversationContext = getConversationContext(sessionId);
    console.log("Conversation Context:", conversationContext);

    // Prepare messages for OpenAI with enhanced context
    const messages = [
      {
        role: "system",
        content:
          SYSTEM_PROMPT +
          `\n\nCURRENT QUESTION ANALYSIS:
- Question Type: ${questionAnalysis.type}
- User Intent: ${questionAnalysis.intent}
- Context: ${questionAnalysis.context || "general"}
- Sentiment: ${questionAnalysis.sentiment || "neutral"}
- Complexity: ${questionAnalysis.complexity}
- Is Question: ${questionAnalysis.isQuestion}

CONVERSATION CONTEXT:
${
  conversationContext
    ? `
- User's Industry: ${
        conversationContext.userPreferences.industry || "Not specified"
      }
- Budget Mentioned: ${
        conversationContext.userPreferences.budget || "Not specified"
      }
- Timeline Preferences: ${
        conversationContext.userPreferences.timeline || "Not specified"
      }
- Previous Topics: ${conversationContext.preferredTopics.join(", ") || "None"}
- Common Question Types: ${
        conversationContext.commonIntents.join(", ") || "None"
      }
- Conversation Length: ${conversationContext.conversationLength} messages
- Last Topic: ${conversationContext.lastTopic || "None"}
`
    : "- No previous conversation context available"
}

Use this analysis and context to provide personalized, intelligent responses that build on previous interactions and address the user's specific needs and question patterns.`,
      },
      ...historyResult.rows.map((row) => ({
        role: row.sender === "user" ? "user" : "assistant",
        content: row.message,
      })),
    ];

    // Call OpenAI API with enhanced context
    console.log("Calling OpenAI API with enhanced analysis:", messages.length);
    let aiResponse;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 600, // Increased for more comprehensive responses
        temperature: questionAnalysis.type === "factual" ? 0.3 : 0.7, // Lower temperature for factual questions
      });

      console.log("OpenAI API response received");
      aiResponse = completion.choices[0].message.content;
      console.log("AI Response:", aiResponse.substring(0, 100) + "...");

      // Enhance response with personalization
      aiResponse = personalizeResponse(questionAnalysis, aiResponse);
    } catch (openaiError) {
      console.error(
        "OpenAI API failed, using enhanced fallback response:",
        openaiError.message
      );

      // Advanced fallback responses with intelligent question analysis
      const lowerMessage = message.toLowerCase();

      // Use the analysis for enhanced fallback responses
      console.log("Using enhanced fallback with analysis:", questionAnalysis);

      // Question Type Analysis
      const isQuestion =
        lowerMessage.includes("?") ||
        lowerMessage.startsWith("what") ||
        lowerMessage.startsWith("how") ||
        lowerMessage.startsWith("why") ||
        lowerMessage.startsWith("when") ||
        lowerMessage.startsWith("where") ||
        lowerMessage.startsWith("who") ||
        lowerMessage.startsWith("which") ||
        lowerMessage.startsWith("can") ||
        lowerMessage.startsWith("do") ||
        lowerMessage.startsWith("does") ||
        lowerMessage.startsWith("is") ||
        lowerMessage.startsWith("are") ||
        lowerMessage.startsWith("will");

      const isGreeting =
        lowerMessage.includes("hello") ||
        lowerMessage.includes("hi") ||
        lowerMessage.includes("hey") ||
        lowerMessage.includes("good morning") ||
        lowerMessage.includes("good afternoon") ||
        lowerMessage.includes("good evening");

      const isIntroduction =
        lowerMessage.includes("i am") ||
        lowerMessage.includes("my name is") ||
        lowerMessage.includes("call me") ||
        lowerMessage.includes("i'm");

      const isServiceInquiry =
        lowerMessage.includes("service") ||
        lowerMessage.includes("what do you") ||
        lowerMessage.includes("offer") ||
        lowerMessage.includes("provide") ||
        lowerMessage.includes("solution") ||
        lowerMessage.includes("development");

      const isTechnicalQuestion =
        lowerMessage.includes("how") ||
        lowerMessage.includes("technical") ||
        lowerMessage.includes("technology") ||
        lowerMessage.includes("framework") ||
        lowerMessage.includes("language") ||
        lowerMessage.includes("database");

      const isBusinessQuestion =
        lowerMessage.includes("cost") ||
        lowerMessage.includes("price") ||
        lowerMessage.includes("budget") ||
        lowerMessage.includes("timeline") ||
        lowerMessage.includes("roi") ||
        lowerMessage.includes("business");

      const isComparisonQuestion =
        lowerMessage.includes("vs") ||
        lowerMessage.includes("versus") ||
        lowerMessage.includes("compare") ||
        lowerMessage.includes("difference") ||
        lowerMessage.includes("better") ||
        lowerMessage.includes("best");

      const isContactQuestion =
        lowerMessage.includes("contact") ||
        lowerMessage.includes("quote") ||
        lowerMessage.includes("inquiry") ||
        lowerMessage.includes("submit") ||
        lowerMessage.includes("form");

      const isPortfolioQuestion =
        lowerMessage.includes("project") ||
        lowerMessage.includes("work") ||
        lowerMessage.includes("experience") ||
        lowerMessage.includes("case study") ||
        lowerMessage.includes("portfolio") ||
        lowerMessage.includes("past work");

      // Intelligent Response Generation Based on Question Analysis
      if (isGreeting) {
        aiResponse =
          "Hello!👋Welcome to AI Solution. I’m your AI assistant, here to help you explore how our advanced software solutions can empower your business. Whether you're interested in custom development, AI integration, or digital transformation, I’m ready to assist. How can I support your goals today?";
      } else if (isIntroduction) {
        const nameMatch = message.match(
          /(?:i am|my name is|call me|i'm)\s+([a-zA-Z\s]+)/i
        );
        const name = nameMatch ? nameMatch[1].trim() : "valued visitor";
        aiResponse = `Nice to meet you, ${name}. At AI Solution Company, we specialize in delivering innovative software solutions that drive business growth. With over 1000 successful projects across finance, healthcare, and manufacturing, we are committed to turning your ideas into reality. What software solution are you considering for your business?`;
      } else if (isServiceInquiry) {
        if (
          lowerMessage.includes("custom software") ||
          lowerMessage.includes("web") ||
          lowerMessage.includes("mobile")
        ) {
          aiResponse =
            "Thanks for your interest! We offer custom solutions:\n Web Apps (React, Node.js, Python) Mobile Apps (iOS, Android, React Native) Enterprise, E-commerce, CRM & ERP\n\nWant to learn more or discuss your needs? Details: http://localhost:5173/services";
        } else if (
          lowerMessage.includes("ai") ||
          lowerMessage.includes("machine learning") ||
          lowerMessage.includes("automation")
        ) {
          aiResponse =
            "Our AI & ML services boost efficiency up to 300%:\n Automation Systems Predictive Analytics Computer Vision NLP & Decision Making\n\nWhat business challenge can we solve? More info: http://localhost:5173/services";
        } else if (
          lowerMessage.includes("cloud") ||
          lowerMessage.includes("api") ||
          lowerMessage.includes("integration")
        ) {
          aiResponse =
            "We ensure seamless system integration:\n Cloud Migration (AWS, Azure, GCP) API Integration Microservices & Modernization Scalable Hosting\n\nWhat systems are you integrating or migrating?";
        } else {
          aiResponse =
            "We provide:\n Custom Software AI & Machine Learning Cloud & Integration Consulting Digital Transformation\n\nWhat industry or solution interests you? Explore: http://localhost:5173/services";
        }
      } else if (isTechnicalQuestion) {
        if (
          lowerMessage.includes("how long") ||
          lowerMessage.includes("timeline") ||
          lowerMessage.includes("duration")
        ) {
          aiResponse =
            "Typical timelines:\n Simple Web Apps: 4–8 weeks Enterprise Systems: 3–6 months Mobile Apps: 6–12 weeks AI/ML: 2–4 months\n\nWhat’s your project and timeline?";
        } else if (
          lowerMessage.includes("technology") ||
          lowerMessage.includes("stack") ||
          lowerMessage.includes("framework")
        ) {
          aiResponse =
            "We use:\n Frontend: React, Vue, Angular Backend: Node.js, Python, Java Mobile: React Native, Flutter DB: PostgreSQL, MongoDB Cloud: AWS, Azure, GCP AI/ML: TensorFlow, PyTorch\n\nWhat app are you building?";
        } else if (
          lowerMessage.includes("process") ||
          lowerMessage.includes("methodology")
        ) {
          aiResponse =
            "Our process:\n\n1. Discovery & Planning\n2. Design & Architecture\n3. Agile Development\n4. Testing & QA\n5. Deployment\n6. Support\n\nWant details on any step?";
        } else {
          aiResponse =
            "We cover:\n Full-Stack Development API Design DB Architecture Cloud & DevOps AI/ML Models System Integration\n\nWhat technical challenge interests you?";
        }
      } else if (isBusinessQuestion) {
        if (
          lowerMessage.includes("cost") ||
          lowerMessage.includes("price") ||
          lowerMessage.includes("budget")
        ) {
          aiResponse =
            "Pricing depends on:\n Project scope Tech stack Timeline Team size Support needs\n\nReady to discuss your project? Contact: http://localhost:5173/contact";
        } else if (
          lowerMessage.includes("roi") ||
          lowerMessage.includes("return") ||
          lowerMessage.includes("benefit")
        ) {
          aiResponse =
            "Clients see:\n Increased efficiency Cost savings Faster time-to-market ROI in 6–12 months\n\nWhat outcomes matter most to you?";
        } else {
          aiResponse =
            "We help businesses:\n Grow revenue Cut costs Scale operations Make data-driven decisions Improve customer satisfaction\n\nWhat challenges can we solve?";
        }
      } else if (isComparisonQuestion) {
        aiResponse =
          "Why choose us?\n\n✅ 1000+ projects\n✅ 98% satisfaction\n✅ End-to-end solutions\n✅ Latest tech\n✅ Transparent communication\n✅ Post-launch support\n\nWant a detailed comparison?";
      } else if (isContactQuestion) {
        aiResponse =
          "Ready to start?\n\n1. Quick chat: submit project details here\n2. Contact form: http://localhost:5173/contact\n\nWhat info do you have?";
      } else if (isPortfolioQuestion) {
        aiResponse =
          "Our portfolio:\n Finance, Healthcare, Manufacturing, Education, Retail Enterprise, Mobile, AI, Cloud, Legacy modernization\n\nExplore case studies: http://localhost:5173/case-studies\nWhat industry interests you?";
      } else if (
        lowerMessage.includes("who are you") ||
        lowerMessage.includes("what are you")
      ) {
        aiResponse =
          "I’m your AI assistant from AI Solution, here to help with services, projects, and questions. How can I assist?";
      } else if (
        lowerMessage.includes("blog") ||
        lowerMessage.includes("article") ||
        lowerMessage.includes("news") ||
        lowerMessage.includes("insights")
      ) {
        aiResponse =
          "Our blog covers:\n Tech trends Software best practices AI & ML insights Cloud & DevOps Industry strategies\n\nVisit: http://localhost:5173/blog\nAny topic of interest?";
      } else if (
        lowerMessage.includes("event") ||
        lowerMessage.includes("webinar") ||
        lowerMessage.includes("workshop") ||
        lowerMessage.includes("conference")
      ) {
        aiResponse =
          "Join our events:\n Webinars Workshops Networking Demos Tech Talks\n\nSee schedule: http://localhost:5173/events\nInterested in a specific event?";
      } else if (
        lowerMessage.includes("gallery") ||
        lowerMessage.includes("photo") ||
        lowerMessage.includes("image") ||
        lowerMessage.includes("showcase")
      ) {
        aiResponse =
          "Check out our gallery:\n Project screenshots Event photos Office life Team activities\n\nExplore: http://localhost:5173/gallery\nWhat would you like to see?";
      } else if (
        lowerMessage.includes("feedback") ||
        lowerMessage.includes("testimonial") ||
        lowerMessage.includes("review") ||
        lowerMessage.includes("client")
      ) {
        aiResponse =
          "Clients say:\n On-time delivery Expert tech skills Great communication Real solutions Outstanding support\n\nRead reviews: http://localhost:5173/feedback\nWant testimonials from your industry?";
      } else if (
        lowerMessage.includes("thank") ||
        lowerMessage.includes("thanks")
      ) {
        aiResponse =
          "You’re welcome! 😊 I’m here anytime to help with services, projects, tech, or connecting you with our team.";
      } else if (isQuestion) {
        if (lowerMessage.includes("why") || lowerMessage.includes("benefit")) {
          aiResponse =
            "Why choose AI Solution?\n 1000+ successful projects Latest tech & best practices 98% client satisfaction End-to-end service Transparent communication\n\nWhat benefits matter most to you?";
        } else if (
          lowerMessage.includes("how") &&
          (lowerMessage.includes("start") || lowerMessage.includes("begin"))
        ) {
          aiResponse =
            "Getting started is easy:\n\n1. Define your vision\n2. Explore solutions\n3. Submit requirements: http://localhost:5173/contact\n4. Receive a custom quote\n5. Begin development\n\nWhat project do you have in mind?";
        } else {
          aiResponse =
            "I can help with:\n Services info Project examples Tech advice Submitting requirements Development process\n\nWhat would you like to know?";
        }
      } else {
        if (lowerMessage.includes("help") || lowerMessage.includes("assist")) {
          aiResponse =
            "I’m here to help!\n Learn about services View portfolio Submit projects Understand processes Connect with our team\n\nQuick links: http://localhost:5173/services http://localhost:5173/case-studies http://localhost:5173/contact http://localhost:5173/blog\n\nWhat can I assist with?";
        } else if (
          lowerMessage.includes("nice") ||
          lowerMessage.includes("good") ||
          lowerMessage.includes("great") ||
          lowerMessage.includes("awesome")
        ) {
          aiResponse =
            "Thanks! 🌟 We’re passionate about delivering software that makes a difference and building lasting client partnerships.\n\nWhat caught your interest?";
        } else {
          aiResponse =
            "Welcome to AI Solution! I’m your AI assistant ready to support:\n Services & capabilities Portfolio of 1000+ projects Project submissions Tech & business questions\n\nGet started: Services: http://localhost:5173/services Portfolio: http://localhost:5173/case-studies Contact: http://localhost:5173/contact Feedback: http://localhost:5173/feedback\n\nHow can I assist you today?";
        }

        // Apply personalization to fallback responses too
        aiResponse = personalizeResponse(questionAnalysis, aiResponse);
      }
    }

    // Save AI response to database
    await pool.query(
      "INSERT INTO chat_messages (session_id, sender, message) VALUES ($1, $2, $3)",
      [sessionId, "bot", aiResponse]
    );

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error processing chat message:", error);

    // Check if it's an OpenAI API error
    if (error.response) {
      console.error(
        "OpenAI API Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.code) {
      console.error("OpenAI Error Code:", error.code);
    }

    res.status(500).json({
      error: "Failed to process message",
      response:
        "I apologize for the inconvenience! 🔧 As AI Solution's AI assistant, I'm here to help you with your software development needs. While I'm experiencing a temporary technical issue, our team of expert developers is always ready to assist you directly. You can:\n Visit our Services page: http://localhost:5173/services to explore our offerings Contact us directly: http://localhost:5173/contact to submit your project requirements Call our support team for immediate assistance\n\nWe value your interest in our services and would love to help bring your project to life. Please try again in a moment, or feel free to reach out through our contact form!",
    });
  }
});

// 📌 Submit job inquiry from chat
router.post("/submit-inquiry", async (req, res) => {
  try {
    const { sessionId, inquiryData } = req.body;

    if (!inquiryData || !inquiryData.name || !inquiryData.email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Insert inquiry into database
    const result = await pool.query(
      `INSERT INTO inquiries
       (name, email, phone, company, country, job_title, job_details, status, priority, inquiry_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', 'normal', NOW(), NULL)
       RETURNING *`,
      [
        inquiryData.name,
        inquiryData.email,
        inquiryData.phone || null,
        inquiryData.company || null,
        inquiryData.country || null,
        inquiryData.jobTitle || null,
        inquiryData.jobDetails || null,
      ]
    );

    // Mark session as converted
    if (sessionId) {
      await pool.query(
        "UPDATE chat_sessions SET is_converted = TRUE WHERE session_id = $1",
        [sessionId]
      );
    }

    res.json({
      success: true,
      message:
        "Your inquiry has been submitted successfully. Our team will contact you shortly.",
      inquiry: result.rows[0],
    });
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
});

// 📌 Get chat history for a session
router.get("/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await pool.query(
      "SELECT sender, message, timestamp FROM chat_messages WHERE session_id = $1 ORDER BY timestamp ASC",
      [sessionId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// 📌 Update conversion status
router.post("/update-conversion", async (req, res) => {
  try {
    const { sessionId, isConverted } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    await pool.query(
      "UPDATE chat_sessions SET is_converted = $1 WHERE session_id = $2",
      [isConverted, sessionId]
    );

    console.log(
      `Updated conversion status for session ${sessionId}: ${isConverted}`
    );
    res.json({ message: "Conversion status updated successfully" });
  } catch (error) {
    console.error("Error updating conversion status:", error);
    res.status(500).json({ error: "Failed to update conversion status" });
  }
});

// 📌 End chat session
router.post("/end-session", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    await pool.query(
      "UPDATE chat_sessions SET ended_at = NOW() WHERE session_id = $1",
      [sessionId]
    );

    // Clean up conversation memory when session ends
    if (conversationMemory.has(sessionId)) {
      conversationMemory.delete(sessionId);
      console.log(`Cleaned up conversation memory for session: ${sessionId}`);
    }

    res.json({ message: "Chat session ended successfully" });
  } catch (error) {
    console.error("Error ending chat session:", error);
    res.status(500).json({ error: "Failed to end chat session" });
  }
});

// 📌 Memory cleanup utility (runs every hour)
setInterval(() => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  for (const [sessionId, memory] of conversationMemory.entries()) {
    if (memory.lastInteraction && memory.lastInteraction < oneHourAgo) {
      conversationMemory.delete(sessionId);
      console.log(
        `Cleaned up stale conversation memory for session: ${sessionId}`
      );
    }
  }
}, 60 * 60 * 1000); // Run every hour

// 📌 Test endpoint to verify chatbot is working
router.get("/test", async (req, res) => {
  try {
    const hasApiKey = !!process.env.GPT_API_KEY;
    const apiKeyLength = process.env.GPT_API_KEY
      ? process.env.GPT_API_KEY.length
      : 0;

    res.json({
      status: "Chatbot API is running",
      openaiConfigured: hasApiKey,
      apiKeyLength: apiKeyLength,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.status(500).json({ error: "Test endpoint failed" });
  }
});

module.exports = router;
