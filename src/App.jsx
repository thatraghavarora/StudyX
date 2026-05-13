import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Bookmark,
  Bot,
  Brain,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Crown,
  Download,
  Eye,
  FileText,
  Flag,
  Gauge,
  Home,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  Mail,
  Menu,
  MessageSquareText,
  PenLine,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  TimerReset,
  Upload,
  UserRound,
  WandSparkles,
  X,
} from "lucide-react";
import {
  answerKey,
  benefits,
  dashboardStats,
  deepInsights,
  features,
  questionReviews,
  recentTests,
  reportActions,
  reviewStats,
  sectionPerformance,
  sections,
  testQuestion,
} from "./data/studyHubData.js";

const routes = ["/", "/login", "/dashboard", "/test", "/review"];

function App() {
  const [location, setLocation] = useState(() => readLocation());

  useEffect(() => {
    const onPopState = () => setLocation(readLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to) => {
    const nextLocation = parseLocation(to);
    window.history.pushState({}, "", nextLocation.href);
    setLocation(nextLocation);
    requestAnimationFrame(() => {
      if (nextLocation.hash) {
        document.querySelector(nextLocation.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const page = useMemo(() => {
    if (location.path === "/login") return <LoginPage navigate={navigate} search={location.search} />;
    if (location.path === "/dashboard") return <DashboardPage navigate={navigate} search={location.search} />;
    if (location.path === "/test") return <TestPage navigate={navigate} />;
    if (location.path === "/review") return <ReviewPage navigate={navigate} />;
    return <LandingPage navigate={navigate} />;
  }, [location]);

  return <div className="app">{page}</div>;
}

function readLocation() {
  return parseLocation(`${window.location.pathname}${window.location.search}${window.location.hash}`);
}

function parseLocation(to) {
  const url = new URL(to, window.location.origin);
  const clean = normalizePath(url.pathname);
  return {
    path: clean,
    search: url.search,
    hash: url.hash,
    href: `${clean}${url.search}${url.hash}`,
  };
}

function normalizePath(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return routes.includes(clean) ? clean : "/";
}

function LinkButton({ to, navigate, className = "", children, ...props }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        navigate(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function Brand({ compact = false, testMode = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <div className="brand-mark">
        <BookIcon />
      </div>
      <div>
        <strong>STUDY HUB</strong>
        {!compact && <span>{testMode ? "Test in Progress" : "AI-Powered Learning"}</span>}
      </div>
    </div>
  );
}

function BookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 36 36" className="book-icon">
      <path d="M8 8.2c4.4 0 7.3 1.2 10 4.2 2.7-3 5.6-4.2 10-4.2v19.3c-4.3 0-7.3 1.3-10 4-2.7-2.7-5.7-4-10-4V8.2Z" />
      <path d="M18 12.4v19.1" />
    </svg>
  );
}

function IconBadge({ icon: Icon, tone = "purple", className = "" }) {
  return (
    <span className={`icon-badge tone-${tone} ${className}`}>
      <Icon size={22} strokeWidth={2.4} />
    </span>
  );
}

function PrimaryButton({ children, icon: Icon = ArrowRight, onClick, className = "" }) {
  return (
    <button className={`button button-primary ${className}`} onClick={onClick}>
      <span>{children}</span>
      <Icon size={22} />
    </button>
  );
}

function GhostButton({ children, icon: Icon, onClick, className = "" }) {
  return (
    <button className={`button button-ghost ${className}`} onClick={onClick}>
      {Icon && <Icon size={20} />}
      <span>{children}</span>
    </button>
  );
}

function LandingPage({ navigate }) {
  const navItems = [
    ["Home", "#top"],
    ["Features", "#features"],
    ["How It Works", "#how-it-works"],
    ["Pricing", "#pricing"],
    ["About Us", "#about-us"],
  ];

  const goToSection = (event, href) => {
    event.preventDefault();
    navigate(`/${href}`);
  };

  return (
    <>
      <header className="site-header" id="top">
        <Brand compact />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([item, href], index) => (
            <a
              key={item}
              className={index === 0 ? "active-nav" : ""}
              href={href}
              onClick={(event) => goToSection(event, href)}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <LinkButton to="/login" navigate={navigate} className="button button-ghost">
            LOGIN
          </LinkButton>
          <LinkButton to="/login?mode=signup" navigate={navigate} className="button button-primary">
            SIGN UP
          </LinkButton>
        </div>
        <button className="menu-button" aria-label="Open navigation">
          <Menu size={24} />
        </button>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="tag tag-green">AI-POWERED STUDY PLATFORM</span>
            <h1>Study smart. Score high.</h1>
            <p>
              Generate custom tests, solve them online, and get AI explanations instantly from any
              topic or uploaded chapter PDF.
            </p>
            <div className="hero-actions">
              <PrimaryButton onClick={() => navigate("/dashboard?mode=quick")}>Generate Test</PrimaryButton>
              <GhostButton icon={Upload} onClick={() => navigate("/dashboard?mode=quick&source=upload")}>
                Upload Chapter
              </GhostButton>
            </div>
            <div className="trust-strip" aria-label="Study Hub trust signal">
              <div className="avatar-row" aria-hidden="true">
                {["A", "N", "S", "M"].map((letter, index) => (
                  <span key={letter} className={`mini-avatar avatar-${index}`}>
                    {letter}
                  </span>
                ))}
                <span className="mini-avatar avatar-count">10K+</span>
              </div>
              <strong>Students trust Study Hub</strong>
            </div>
          </div>
          <HeroProductPreview />
        </section>

        <section className="feature-band" id="features" aria-label="Study Hub features">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <IconBadge icon={feature.icon} tone={feature.tone} />
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="benefit-section">
          <div>
            <span className="tag tag-yellow">PRACTICE / ANALYZE / IMPROVE</span>
            <h2>From study material to exam-ready practice in one clean flow.</h2>
          </div>
          <div className="benefit-grid">
            {benefits.map((benefit) => (
              <article className="benefit-card" key={benefit.title}>
                <IconBadge icon={benefit.icon} tone="purple" />
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </article>
            ))}
          </div>
        </section>

        <HowItWorksSection navigate={navigate} />
        <PricingSection navigate={navigate} />
        <AboutSection navigate={navigate} />
      </main>

      <footer className="site-footer">
        <strong>STUDY HUB</strong>
        <span>AI makes study simple. You make it success.</span>
        <div className="footer-socials">
          <span>IG</span>
          <span>YT</span>
          <span>X</span>
        </div>
      </footer>
    </>
  );
}

function HowItWorksSection({ navigate }) {
  const steps = [
    {
      icon: PenLine,
      title: "Add topic or PDF",
      body: "Start from a typed topic, chapter name, or uploaded study material.",
    },
    {
      icon: WandSparkles,
      title: "Choose generation mode",
      body: "Use Quick Mode for manual control or Deep Mode for past-paper pattern analysis.",
    },
    {
      icon: ClipboardList,
      title: "Solve the test",
      body: "Move through MCQs, Q&A, fill-ups, and true/false questions with progress tracking.",
    },
    {
      icon: Brain,
      title: "Review with AI",
      body: "Get marks, answer keys, explanations, deep reasoning, and improvement reports.",
    },
  ];

  return (
    <section className="how-section" id="how-it-works">
      <div className="section-heading">
        <span className="tag tag-green">HOW IT WORKS</span>
        <h2>Four steps from chapter to complete exam review.</h2>
      </div>
      <div className="step-grid">
        {steps.map((step, index) => (
          <article className="step-card" key={step.title}>
            <span className="step-number">{index + 1}</span>
            <IconBadge icon={step.icon} tone={["purple", "yellow", "green", "pink"][index]} />
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
      <div className="section-actions">
        <PrimaryButton onClick={() => navigate("/dashboard?mode=quick")}>Start Quick Mode</PrimaryButton>
        <GhostButton icon={Brain} onClick={() => navigate("/dashboard?mode=deep")}>
          Try Deep Mode
        </GhostButton>
      </div>
    </section>
  );
}

function PricingSection({ navigate }) {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      tone: "green",
      items: ["Topic-based tests", "Basic review", "Recent test history"],
      action: "Start Free",
      to: "/login?mode=signup",
    },
    {
      name: "Exam Pro",
      price: "Rs. 299/mo",
      tone: "yellow",
      items: ["PDF chapter upload", "Deep Mode patterns", "AI explanation reports"],
      action: "Choose Pro",
      to: "/login?mode=signup",
      featured: true,
    },
    {
      name: "Institute",
      price: "Custom",
      tone: "purple",
      items: ["Class dashboards", "Bulk paper generation", "Shared analytics"],
      action: "Contact Team",
      to: "/#about-us",
    },
  ];

  return (
    <section className="pricing-section" id="pricing">
      <div className="section-heading">
        <span className="tag tag-yellow">PRICING</span>
        <h2>Simple plans for solo study and exam-focused prep.</h2>
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className={`pricing-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
            <IconBadge icon={plan.featured ? Crown : Star} tone={plan.tone} />
            <h3>{plan.name}</h3>
            <strong>{plan.price}</strong>
            <ul>
              {plan.items.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={18} />
                  {item}
                </li>
              ))}
            </ul>
            <button className={`button ${plan.featured ? "button-primary" : "button-ghost"}`} onClick={() => navigate(plan.to)}>
              {plan.action}
              <ArrowRight size={20} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutSection({ navigate }) {
  return (
    <section className="about-section" id="about-us">
      <div>
        <span className="tag tag-green">ABOUT US</span>
        <h2>Study Hub helps students turn any chapter into focused practice.</h2>
        <p>
          The platform is designed for students who need faster paper creation, clearer
          explanations, and a smarter way to revise weak topics before exams.
        </p>
      </div>
      <div className="about-card">
        <IconBadge icon={ShieldCheck} tone="purple" />
        <h3>Built around real study workflows</h3>
        <p>
          Quick Mode gives control. Deep Mode studies previous year patterns. AI Review turns every
          answer into a learning moment.
        </p>
        <button className="button button-yellow" onClick={() => navigate("/dashboard?mode=deep")}>
          Explore Deep Mode
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}

function HeroProductPreview() {
  return (
    <div className="hero-visual" aria-label="Study Hub product preview">
      <div className="mock-window">
        <div className="window-top">
          <span />
          <span />
          <span />
        </div>
        <div className="mock-dashboard">
          <div className="mock-card wide">
            <span className="tag tag-yellow">Quick Mode</span>
            <strong>Organic Chemistry Paper</strong>
            <div className="mock-progress">
              <span style={{ width: "72%" }} />
            </div>
          </div>
          <div className="mock-card">
            <IconBadge icon={Brain} tone="green" />
            <strong>AI Tutor</strong>
            <p>Explains every answer.</p>
          </div>
          <div className="mock-card">
            <IconBadge icon={ShieldCheck} tone="pink" />
            <strong>Deep Mode</strong>
            <p>Past paper pattern analysis.</p>
          </div>
        </div>
      </div>
      <div className="floating-card card-one">
        <IconBadge icon={Sparkles} tone="yellow" />
        <span>AI Generated Tests</span>
      </div>
      <div className="floating-card card-two">
        <IconBadge icon={FileText} tone="green" />
        <span>Detailed Explanations</span>
      </div>
      <div className="floating-card card-three">
        <IconBadge icon={Gauge} tone="purple" />
        <span>Exam Focused</span>
      </div>
    </div>
  );
}

function LoginPage({ navigate, search = "" }) {
  const authMode = new URLSearchParams(search).get("mode") === "signup" ? "signup" : "login";
  const isSignup = authMode === "signup";

  return (
    <main className="login-page">
      <section className="login-intro">
        <Brand />
        <div className="burst">*</div>
        <h1>
          Welcome back,
          <span>champ!</span>
        </h1>
        <span className="tag tag-green">AI-POWERED. YOUR SUCCESS PARTNER.</span>
        <p>
          Login to continue your learning journey, generate tests, solve papers, and improve
          smarter with AI.
        </p>
        <div className="login-perks">
          {[
            ["AI Generated Tests", "Custom tests in seconds", Sparkles],
            ["Detailed Explanations", "Understand every answer", FileText],
            ["Track Progress", "Analyze and improve", BarChart3],
          ].map(([title, body, Icon], index) => (
            <div className="login-perk" key={title}>
              <IconBadge icon={Icon} tone={["purple", "yellow", "pink"][index]} />
              <div>
                <strong>{title}</strong>
                <span>{body}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="auth-card">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        <p>{isSignup ? "Create your AI study account." : "Glad to see you again!"}</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            navigate("/dashboard");
          }}
        >
          {isSignup && (
            <label className="input-row">
              <UserRound size={22} />
              <input type="text" placeholder="Full Name" aria-label="Full Name" />
            </label>
          )}
          <label className="input-row">
            <Mail size={22} />
            <input type="email" placeholder="Email Address" aria-label="Email Address" />
          </label>
          <label className="input-row">
            <LockKeyhole size={22} />
            <input type="password" placeholder="Password" aria-label="Password" />
            <Eye size={20} />
          </label>
          <div className="auth-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#forgot">Forgot Password?</a>
          </div>
          <button className="button button-primary full-button" type="submit">
            {isSignup ? "CREATE ACCOUNT" : "LOGIN"}
          </button>
        </form>
        <div className="divider">
          <span />
          OR
          <span />
        </div>
        <button className="google-button" onClick={() => navigate("/dashboard")}>
          <span>G</span>
          {isSignup ? "Sign up with Google" : "Continue with Google"}
        </button>
        <p className="signup-copy">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button type="button" onClick={() => navigate(isSignup ? "/login" : "/login?mode=signup")}>
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </section>
    </main>
  );
}

function DashboardPage({ navigate, search = "" }) {
  const query = new URLSearchParams(search);
  const requestedMode = query.get("mode") === "deep" ? "deep" : "quick";
  const requestedSource = query.get("source") === "upload" ? "upload" : "topic";
  const [mode, setMode] = useState(requestedMode);

  useEffect(() => {
    setMode(requestedMode);
  }, [requestedMode]);

  return (
    <AppShell active="Dashboard" navigate={navigate}>
      <div className="dashboard-grid">
        <section className="main-panel">
          <div className="dashboard-header">
            <div>
              <h1>Welcome back, Aryan!</h1>
              <p>Create custom tests in seconds and improve your learning.</p>
            </div>
            <button className="button button-yellow" onClick={() => navigate("/#how-it-works")}>
              <CircleHelp size={19} />
              How it works?
            </button>
          </div>

          <div className="mode-tabs" role="tablist" aria-label="Test generation modes">
            <button
              className={mode === "quick" ? "active" : ""}
              onClick={() => setMode("quick")}
              role="tab"
              aria-selected={mode === "quick"}
            >
              <Sparkles size={20} />
              <span>
                QUICK MODE
                <small>Custom test with your own settings</small>
              </span>
            </button>
            <button
              className={mode === "deep" ? "active" : ""}
              onClick={() => setMode("deep")}
              role="tab"
              aria-selected={mode === "deep"}
            >
              <Brain size={20} />
              <span>
                DEEP MODE <b>NEW</b>
                <small>AI creates papers from last 5/10 year patterns</small>
              </span>
            </button>
          </div>

          {mode === "quick" ? (
            <QuickModeForm navigate={navigate} initialSource={requestedSource} />
          ) : (
            <DeepModeForm navigate={navigate} />
          )}
        </section>

        <aside className="dashboard-side">
          <div className="stats-grid">
            {dashboardStats.map((stat) => (
              <article className={`stat-card tone-bg-${stat.tone}`} key={stat.label}>
                <IconBadge icon={stat.icon} tone={stat.tone} />
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
          <UploadCard navigate={navigate} />
          <RecentTests />
        </aside>
      </div>

      <section className="ai-banner">
        <RobotFace />
        <div>
          <h3>Need help in understanding a topic?</h3>
          <p>Ask our AI Tutor anytime, anywhere.</p>
        </div>
        <button className="button button-ghost">
          Ask AI Tutor
          <ArrowRight size={20} />
        </button>
      </section>
    </AppShell>
  );
}

function QuickModeForm({ navigate, initialSource = "topic" }) {
  const [source, setSource] = useState(initialSource);
  useEffect(() => {
    setSource(initialSource);
  }, [initialSource]);

  const questionTypes = [
    { label: "MCQ", value: 20, icon: FileQuestion, tone: "yellow" },
    { label: "Q&A", value: 10, icon: MessageSquareText, tone: "green" },
    { label: "Fill in the Blanks", value: 10, icon: ListChecks, tone: "pink" },
    { label: "True / False", value: 10, icon: CheckCircle2, tone: "purple" },
  ];

  return (
    <div className="builder-card">
      <section className="form-section">
        <h2>1. Enter Topic or Upload Chapter</h2>
        <div className="source-grid">
          <div
            className={`source-option ${source === "topic" ? "active" : ""}`}
            onClick={() => setSource("topic")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") setSource("topic");
            }}
            role="button"
            tabIndex={0}
          >
            <PenLine size={38} />
            <span>
              <strong>Enter Topic / Chapter Name</strong>
              <input placeholder="e.g. Photosynthesis in Plants" aria-label="Topic or chapter name" />
            </span>
          </div>
          <span className="or-chip">or</span>
          <button
            className={`source-option ${source === "upload" ? "active" : ""}`}
            onClick={() => setSource("upload")}
            type="button"
          >
            <Upload size={38} />
            <span>
              <strong>Upload PDF</strong>
              <small>Upload your chapter PDF</small>
            </span>
          </button>
        </div>
      </section>

      <section className="form-section">
        <h2>2. Select Question Types</h2>
        <div className="question-type-grid">
          {questionTypes.map((item) => (
            <label className="number-card" key={item.label}>
              <span className="number-heading">
                <IconBadge icon={item.icon} tone={item.tone} />
                <strong>{item.label}</strong>
              </span>
              <input type="number" defaultValue={item.value} min="0" aria-label={`${item.label} count`} />
            </label>
          ))}
        </div>
      </section>

      <section className="form-section">
        <h2>3. Select Difficulty Level</h2>
        <div className="difficulty-row">
          {["Easy", "Medium", "Hard", "Mixed"].map((item) => (
            <button className={item === "Medium" ? "selected" : ""} key={item}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <PrimaryButton className="generate-button" onClick={() => navigate("/test")} icon={ArrowRight}>
        Generate Question Paper
      </PrimaryButton>
    </div>
  );
}

function DeepModeForm({ navigate }) {
  return (
    <div className="builder-card deep-builder">
      <section className="form-section">
        <h2>1. Choose Exam Context</h2>
        <div className="deep-grid">
          <SelectLike icon={GraduationIcon} label="Course" value="BCA" />
          <SelectLike icon={BookOpenIcon} label="Subject" value="Mathematics" />
          <SelectLike icon={NotebookIcon} label="Topic / Chapter" value="Matrix" />
          <SelectLike icon={ClockIcon} label="Paper Reference" value="Last 5 Years" />
        </div>
      </section>

      <section className="form-section">
        <h2>2. AI Exam Pattern Analysis</h2>
        <div className="deep-insight-grid">
          {deepInsights.map((insight, index) => (
            <article className="deep-insight" key={insight.title}>
              <IconBadge icon={insight.icon} tone={["purple", "yellow", "green", "pink"][index]} />
              <div>
                <strong>{insight.title}</strong>
                <p>{insight.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="trend-panel">
        <div>
          <span className="tag tag-green">AUTO-READY PAPER</span>
          <h3>BCA Mathematics - Matrix</h3>
          <p>
            Expected weight: 14 marks. High-repeat concepts: inverse matrix, determinants, rank,
            and linear equations.
          </p>
        </div>
        <div className="trend-bars" aria-label="Chapter importance">
          {["Matrix", "Determinants", "Vectors"].map((label, index) => (
            <div key={label}>
              <span>{label}</span>
              <b style={{ width: ["92%", "74%", "48%"][index] }} />
            </div>
          ))}
        </div>
      </section>

      <PrimaryButton className="generate-button" onClick={() => navigate("/test")} icon={ArrowRight}>
        Generate Exam Pattern Paper
      </PrimaryButton>
    </div>
  );
}

function SelectLike({ icon: Icon, label, value }) {
  return (
    <button className="select-like">
      <Icon size={24} />
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
      <ChevronDown size={20} />
    </button>
  );
}

function AppShell({ children, active, navigate }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <Brand compact />
        <nav className="side-nav" aria-label="Dashboard navigation">
          {[
            [LayoutDashboard, "Dashboard", "/dashboard"],
            [Plus, "Generate Test", "/dashboard?mode=quick"],
            [Brain, "Deep Mode", "/dashboard?mode=deep", "NEW"],
            [ClipboardList, "My Tests", "/dashboard"],
            [BarChart3, "Results", "/review"],
            [Sparkles, "AI Tutor", "/dashboard"],
            [Bookmark, "Bookmarks", "/dashboard"],
            [Download, "Downloads", "/dashboard"],
            [FileText, "Study Material", "/dashboard"],
            [Settings, "Settings", "/dashboard"],
          ].map(([Icon, label, to, badge]) => (
            <button
              key={label}
              className={active === label || (active === "Dashboard" && label === "Dashboard") ? "active" : ""}
              onClick={() => navigate(to)}
            >
              <Icon size={22} />
              <span>{label}</span>
              {badge && <b>{badge}</b>}
            </button>
          ))}
        </nav>
        <div className="premium-card">
          <Crown size={34} />
          <h3>Go Premium</h3>
          <p>Unlock Deep Mode, AI Tutor and more powerful features.</p>
          <button className="button button-yellow">
            Upgrade Now
            <ArrowRight size={20} />
          </button>
        </div>
      </aside>

      <main className="workspace">
        <header className="workspace-topbar">
          <label className="search-box">
            <Search size={22} />
            <input placeholder="Search anything..." aria-label="Search anything" />
          </label>
          <div className="profile-area">
            <span className="premium-pill">
              <Crown size={17} />
              Premium Plan
            </span>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={22} />
              <i />
            </button>
            <button className="profile-button">
              <span>A</span>
              Hi, Aryan!
              <ChevronDown size={17} />
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function UploadCard({ navigate }) {
  return (
    <article className="upload-card">
      <h3>
        <Upload size={20} />
        Quick Upload
      </h3>
      <p>Upload chapter PDF and get instant test</p>
      <button onClick={() => navigate("/dashboard?mode=quick&source=upload")}>
        <Upload size={22} />
        <strong>Upload PDF</strong>
        <span>or drag and drop here</span>
      </button>
    </article>
  );
}

function RecentTests() {
  return (
    <article className="recent-card">
      <header>
        <h3>Recent Tests</h3>
        <a href="#all">View All</a>
      </header>
      <div className="recent-list">
        {recentTests.map((test) => (
          <div className="recent-item" key={test.title}>
            <IconBadge icon={test.icon} tone={test.tone} />
            <span>
              <strong>{test.title}</strong>
              <small>{test.meta}</small>
            </span>
            <b>{test.score}</b>
            <small>{test.time}</small>
          </div>
        ))}
      </div>
    </article>
  );
}

function TestPage({ navigate }) {
  return (
    <main className="test-page">
      <header className="test-topbar">
        <Brand testMode />
        <div className="timer-card">
          <TimerReset size={26} />
          <span>
            <strong>00:32:45</strong>
            Time Left
          </span>
        </div>
        <div className="test-progress">
          <strong>Question {testQuestion.number} of {testQuestion.total}</strong>
          <span>17%</span>
          <div>
            <b style={{ width: "17%" }} />
          </div>
        </div>
        <div className="test-actions">
          <button className="button button-ghost">
            <Calculator size={20} />
            Calculator
          </button>
          <button className="button button-ghost">
            <Flag size={20} />
            Flag
          </button>
          <button className="button button-pink" onClick={() => navigate("/review")}>
            <Upload size={20} />
            Submit Test
          </button>
        </div>
      </header>

      <div className="test-layout">
        <aside className="question-sidebar">
          <span className="tag tag-yellow">SECTIONS</span>
          {sections.map((section) => (
            <button className={section.label === "MCQ" ? "active" : ""} key={section.label}>
              <span>{section.label} ({section.count})</span>
              <b>{section.answered}/{section.count}</b>
            </button>
          ))}
          <span className="tag tag-yellow">QUESTION NAVIGATION</span>
          <div className="question-grid" aria-label="Question navigation">
            {Array.from({ length: 20 }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                className={
                  number === 7 ? "current" : number < 7 ? "answered" : [8, 9].includes(number) ? "review" : ""
                }
              >
                {number}
              </button>
            ))}
          </div>
          <div className="legend-row">
            <span><i className="answered" /> Answered</span>
            <span><i className="review" /> Review</span>
            <span><i /> Not Answered</span>
          </div>
          <button className="button button-ghost prev-section">
            <ArrowLeft size={20} />
            Previous Section
          </button>
        </aside>

        <section className="question-panel">
          <header>
            <span className="question-type">{testQuestion.type}</span>
            <strong>Multiple Choice Question</strong>
            <div className="marks">
              Marks:
              <b>{testQuestion.marks}</b>
              <em>{testQuestion.negative}</em>
            </div>
            <button aria-label="Bookmark question">
              <Bookmark size={22} />
            </button>
          </header>
          <div className="question-body">
            <h1>{testQuestion.title}</h1>
            <div className="formula-line" aria-label="Question molecule diagram">
              <span>H<sub>3</sub>C</span>
              <i />
              <span>CH<sub>2</sub></span>
              <i />
              <span>CH<sub>2</sub></span>
              <i />
              <span>COOH</span>
            </div>
            <div className="option-list">
              {testQuestion.options.map((option) => (
                <button className={option.selected ? "selected" : ""} key={option.key}>
                  <span>{option.key}</span>
                  {option.label}
                </button>
              ))}
            </div>
            <label className="review-check">
              <input type="checkbox" />
              Mark for Review
            </label>
          </div>
          <footer>
            <button className="button button-ghost">
              <ArrowLeft size={20} />
              Previous
            </button>
            <button className="button button-primary">
              Next
              <ArrowRight size={20} />
            </button>
          </footer>
        </section>

        <AiTutorPanel compact />
      </div>

      <footer className="test-footer">
        <span><b>Test Name:</b> Organic Chemistry - Carboxylic Acids</span>
        <span><b>Difficulty:</b> <mark>Medium</mark></span>
        <span><b>Total Marks:</b> 100</span>
        <span><b>Negative Marking:</b> Yes (1/4th)</span>
        <button className="button button-yellow">
          <FileText size={20} />
          Question Paper
        </button>
      </footer>
    </main>
  );
}

function AiTutorPanel({ compact = false }) {
  return (
    <aside className={`ai-panel ${compact ? "compact" : ""}`}>
      <header>
        <span>
          <Sparkles size={22} />
          AI TUTOR
          <b>BETA</b>
        </span>
        <X size={18} />
      </header>
      <div className="ai-message">
        <RobotFace />
        <p>
          {compact
            ? "Need help with this question? I can explain the concept, eliminate options, or give you a hint."
            : "Hi Aryan! Click on any question to get a detailed explanation."}
        </p>
      </div>
      {compact ? (
        <>
          <div className="ai-action-grid">
            <button>Explain Concept</button>
            <button>Hint</button>
            <button>Eliminate Options</button>
          </div>
          <section className="quick-notes">
            <h3>Quick Notes</h3>
            <p>Carboxylic acid has -COOH group. Count the longest chain including -COOH.</p>
          </section>
          <section className="explanation-preview">
            <h3>AI Explanation Preview</h3>
            <p>
              The compound has 4 carbon atoms including the carboxyl carbon. Therefore, the
              correct IUPAC name is Butanoic acid.
            </p>
            <button className="button button-ghost">
              <Sparkles size={18} />
              Show Full Explanation
            </button>
          </section>
        </>
      ) : (
        <ReviewExplanation />
      )}
    </aside>
  );
}

function ReviewPage({ navigate }) {
  return (
    <div className="review-shell">
      <aside className="sidebar review-sidebar">
        <Brand compact />
        <nav className="side-nav" aria-label="Results navigation">
          {[
            [LayoutDashboard, "Dashboard", "/dashboard"],
            [Plus, "Generate Test", "/dashboard?mode=quick"],
            [Brain, "Deep Mode", "/dashboard?mode=deep", "NEW"],
            [ClipboardList, "My Tests", "/dashboard"],
            [BarChart3, "Results", "/review"],
            [Sparkles, "AI Tutor", "/review"],
            [Bookmark, "Bookmarks", "/review"],
            [Download, "Downloads", "/review"],
            [FileText, "Study Material", "/review"],
            [Settings, "Settings", "/review"],
          ].map(([Icon, label, to, badge]) => (
            <button className={label === "Results" ? "active" : ""} key={label} onClick={() => navigate(to)}>
              <Icon size={22} />
              <span>{label}</span>
              {badge && <b>{badge}</b>}
            </button>
          ))}
        </nav>
        <div className="premium-card">
          <Crown size={34} />
          <h3>Go Premium</h3>
          <p>Unlock Deep Mode, AI Tutor and more powerful features.</p>
          <button className="button button-yellow">
            Upgrade Now
            <ArrowRight size={20} />
          </button>
        </div>
      </aside>

      <main className="review-main">
        <header className="review-header">
          <div>
            <h1>Test Completed!</h1>
            <p>Great job, Aryan! Here&apos;s your performance.</p>
          </div>
          <div>
            <button className="button button-ghost">
              <Download size={20} />
              Download Report
            </button>
            <button className="button button-yellow" onClick={() => navigate("/test")}>
              <RefreshCcw size={20} />
              Retake Test
            </button>
            <button className="button button-primary" onClick={() => navigate("/dashboard")}>
              <Home size={20} />
              Go to Dashboard
            </button>
          </div>
        </header>

        <div className="review-content">
          <section className="review-left">
            <div className="result-stats">
              {reviewStats.map((stat) => (
                <article className={`result-stat tone-bg-${stat.tone}`} key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </article>
              ))}
            </div>

            <section className="performance-card">
              <div className="donut-card" aria-label="Performance overview">
                <div className="donut">
                  <span>
                    <strong>78.5%</strong>
                    Score
                  </span>
                </div>
                <div className="donut-legend">
                  <span><i className="good" /> Correct 31 (77.5%)</span>
                  <span><i className="bad" /> Incorrect 7 (17.5%)</span>
                  <span><i className="skip" /> Skipped 2 (5%)</span>
                </div>
              </div>
              <div className="section-performance">
                <h2>Section Wise Performance</h2>
                {sectionPerformance.map((item) => (
                  <div className="bar-row" key={item.label}>
                    <span>{item.label}</span>
                    <b>{item.value}</b>
                    <div>
                      <i style={{ width: item.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="answer-key-card">
              <header>
                <h2>Full Answer Key</h2>
                <span className="tag tag-green">WITH REASONS</span>
              </header>
              <div className="answer-key-grid">
                {answerKey.map((item) => (
                  <article key={item.q}>
                    <strong>{item.q}</strong>
                    <span>{item.answer}</span>
                    <p>{item.reason}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="question-review-card">
              <header>
                <h2>Question Review</h2>
                <div className="filter-pills">
                  {["All", "Correct", "Incorrect", "Skipped"].map((item) => (
                    <button className={item === "All" ? "active" : ""} key={item}>
                      {item}
                    </button>
                  ))}
                </div>
              </header>
              <div className="review-question-list">
                {questionReviews.map((question) => (
                  <article className={`review-question ${question.status}`} key={question.id}>
                    <strong>{question.id}</strong>
                    {question.status === "correct" ? (
                      <Check size={20} />
                    ) : question.status === "incorrect" ? (
                      <X size={20} />
                    ) : (
                      <span className="dash">–</span>
                    )}
                    <span className="question-type small">{question.type}</span>
                    <p>{question.question}</p>
                    <b>{question.marks}</b>
                    <ChevronDown size={20} />
                  </article>
                ))}
              </div>
              <button className="button button-yellow centered">
                <ListChecks size={20} />
                View All Questions
              </button>
            </section>

            <section className="report-banner">
              <RobotFace />
              <div>
                <h3>Need a detailed performance analysis?</h3>
                <p>Ask AI Tutor for a deep report on your weak topics and improvement tips.</p>
              </div>
              <button className="button button-ghost">
                Get Detailed Report
                <ArrowRight size={20} />
              </button>
            </section>
          </section>

          <AiTutorPanel />
        </div>
      </main>
    </div>
  );
}

function ReviewExplanation() {
  return (
    <>
      <section className="review-explanation">
        <header>
          <h3>Explanation for Q.7</h3>
          <span>Incorrect</span>
        </header>
        <strong>Question</strong>
        <p>The pKa value of acetic acid is approximately:</p>
        <p>Your Answer: <b className="wrong">B) 3.75</b></p>
        <p>Correct Answer: <b className="right">C) 4.76</b></p>
        <strong>Explanation</strong>
        <p>
          Acetic acid (CH3COOH) has a pKa value of approximately 4.76. It is a weak acid that
          partially dissociates in water. Lower pKa means stronger acid.
        </p>
        <strong>Detailed Reason</strong>
        <p>
          pKa is -log10(Ka). Acetic acid has a Ka of about 1.8 x 10^-5, therefore pKa is about
          4.74 to 4.76.
        </p>
        <button className="button button-ghost full-button">
          <Sparkles size={18} />
          Explain More with AI
        </button>
      </section>
      <section className="report-actions">
        <h3>Detailed Report Includes</h3>
        {reportActions.map((action) => (
          <span key={action}>
            <CheckCircle2 size={17} />
            {action}
          </span>
        ))}
      </section>
      <label className="ask-anything">
        <input placeholder="Ask Anything" aria-label="Ask AI Tutor anything" />
        <ArrowRight size={20} />
      </label>
    </>
  );
}

function RobotFace() {
  return (
    <div className="robot-face" aria-hidden="true">
      <Bot size={32} />
    </div>
  );
}

function GraduationIcon(props) {
  return <UserRound {...props} />;
}

function BookOpenIcon(props) {
  return <FileText {...props} />;
}

function NotebookIcon(props) {
  return <ClipboardList {...props} />;
}

function ClockIcon(props) {
  return <TimerReset {...props} />;
}

export default App;
