import { useCallback, useEffect, useMemo, useState } from "react";
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
  FileQuestion,
  FileText,
  Flag,
  Gauge,
  Home,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  LogOut,
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
import { supabase } from "./lib/supabaseClient.js";
import { generateStudyTest } from "./lib/geminiClient.js";

const routes = ["/", "/login", "/dashboard", "/test", "/review"];
const protectedRoutes = ["/dashboard", "/test", "/review"];

function App() {
  const [location, setLocation] = useState(() => readLocation());
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const onPopState = () => setLocation(readLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((to) => {
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
  }, []);

  useEffect(() => {
    let active = true;

    const cleanAuthUrl = () => {
      if (!hasAuthParams(window.location.hash, window.location.search)) return;
      const cleanUrl = stripAuthParams(window.location.pathname, window.location.search);
      window.history.replaceState({}, "", cleanUrl);
      setLocation(readLocation());
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setAuthLoading(false);
      cleanAuthUrl();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setAuthLoading(false);
      cleanAuthUrl();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (protectedRoutes.includes(location.path) && !session) {
      navigate(`/login?redirect=${encodeURIComponent(location.href)}`);
      return;
    }

    if (location.path === "/login" && session) {
      const redirectTo = getSafeRedirect(new URLSearchParams(location.search).get("redirect"));
      navigate(redirectTo);
    }
  }, [authLoading, location, navigate, session]);

  const page = useMemo(() => {
    if (authLoading && protectedRoutes.includes(location.path)) return <LoadingPage />;
    if (location.path === "/login") return <LoginPage navigate={navigate} search={location.search} />;
    if (location.path === "/dashboard") return <DashboardPage navigate={navigate} search={location.search} />;
    if (location.path === "/test") return <TestPage navigate={navigate} />;
    if (location.path === "/review") return <ReviewPage navigate={navigate} />;
    return <LandingPage navigate={navigate} />;
  }, [authLoading, location, navigate]);

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

function hasAuthParams(hash = "", search = "") {
  const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  const searchParams = new URLSearchParams(search);
  return Boolean(
    hashParams.get("access_token") ||
      hashParams.get("refresh_token") ||
      hashParams.get("error") ||
      hashParams.get("error_code") ||
      searchParams.get("code") ||
      searchParams.get("error") ||
      searchParams.get("error_code"),
  );
}

function stripAuthParams(pathname, search = "") {
  const params = new URLSearchParams(search);
  ["code", "error", "error_code", "error_description"].forEach((key) => params.delete(key));
  const nextSearch = params.toString();
  return `${pathname}${nextSearch ? `?${nextSearch}` : ""}`;
}

function getSafeRedirect(value) {
  if (!value) return "/dashboard";

  try {
    const url = new URL(value, window.location.origin);
    const path = normalizePath(url.pathname);
    if (!protectedRoutes.includes(path)) return "/dashboard";
    return `${path}${url.search}${url.hash}`;
  } catch {
    return "/dashboard";
  }
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

function PrimaryButton({ children, icon: Icon = ArrowRight, onClick, className = "", disabled = false }) {
  return (
    <button className={`button button-primary ${className}`} onClick={onClick} disabled={disabled}>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    ["Home", "#top"],
    ["Features", "#features"],
    ["How It Works", "#how-it-works"],
    ["Pricing", "#pricing"],
    ["About Us", "#about-us"],
  ];

  const goToSection = (event, href) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    navigate(`/${href}`);
  };

  const goToPage = (event, to) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    navigate(to);
  };

  return (
    <>
      <header className={`site-header ${mobileMenuOpen ? "menu-open" : ""}`} id="top">
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
        <button
          className="menu-button"
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(([item, href]) => (
            <a key={item} href={href} onClick={(event) => goToSection(event, href)}>
              {item}
            </a>
          ))}
          <a href="/dashboard?mode=quick" onClick={(event) => goToPage(event, "/dashboard?mode=quick")}>
            Generate Test
          </a>
          <a
            href="/dashboard?mode=quick&source=upload"
            onClick={(event) => goToPage(event, "/dashboard?mode=quick&source=upload")}
          >
            Upload Chapter
          </a>
          <a href="/login" onClick={(event) => goToPage(event, "/login")}>
            Login
          </a>
          <a
            href="/login?mode=signup"
            className="primary-mobile-action"
            onClick={(event) => goToPage(event, "/login?mode=signup")}
          >
            Sign Up
          </a>
        </nav>
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
              <LinkButton to="/dashboard?mode=quick" navigate={navigate} className="button button-primary">
                <span>Generate Test</span>
                <ArrowRight size={22} />
              </LinkButton>
              <LinkButton
                to="/dashboard?mode=quick&source=upload"
                navigate={navigate}
                className="button button-ghost"
              >
                <Upload size={20} />
                <span>Upload Chapter</span>
              </LinkButton>
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
  const loginParams = new URLSearchParams(search);
  const authMode = loginParams.get("mode") === "signup" ? "signup" : "login";
  const redirectTo = getSafeRedirect(loginParams.get("redirect"));
  const isSignup = authMode === "signup";
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [authStatus, setAuthStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) {
        navigate(redirectTo);
      }
    });

    return () => {
      active = false;
    };
  }, [navigate, redirectTo]);

  const updateField = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleEmailAuth = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthStatus({ type: "", message: "" });

    const email = formData.email.trim();
    const password = formData.password;
    const fullName = formData.fullName.trim();

    const { data, error } = isSignup
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}${redirectTo}`,
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    setIsSubmitting(false);

    if (error) {
      setAuthStatus({ type: "error", message: error.message });
      return;
    }

    if (data.session) {
      navigate(redirectTo);
      return;
    }

    setAuthStatus({
      type: "success",
      message: "Check your email to confirm your account, then come back to login.",
    });
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setAuthStatus({ type: "", message: "" });

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${redirectTo}`,
      },
    });

    if (error) {
      setIsSubmitting(false);
      setAuthStatus({ type: "error", message: error.message });
    }
  };

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
          onSubmit={handleEmailAuth}
        >
          {isSignup && (
            <label className="input-row">
              <UserRound size={22} />
              <input
                type="text"
                placeholder="Full Name"
                aria-label="Full Name"
                value={formData.fullName}
                onChange={updateField("fullName")}
                required
              />
            </label>
          )}
          <label className="input-row">
            <Mail size={22} />
            <input
              type="email"
              placeholder="Email Address"
              aria-label="Email Address"
              value={formData.email}
              onChange={updateField("email")}
              required
            />
          </label>
          <label className="input-row">
            <LockKeyhole size={22} />
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              value={formData.password}
              onChange={updateField("password")}
              minLength={6}
              required
            />
            <Eye size={20} />
          </label>
          {authStatus.message && (
            <p className={`auth-message ${authStatus.type === "error" ? "auth-error" : "auth-success"}`}>
              {authStatus.message}
            </p>
          )}
          <div className="auth-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#forgot">Forgot Password?</a>
          </div>
          <button className="button button-primary full-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "PLEASE WAIT..." : isSignup ? "CREATE ACCOUNT" : "LOGIN"}
          </button>
        </form>
        <div className="divider">
          <span />
          OR
          <span />
        </div>
        <button className="google-button" onClick={handleGoogleAuth} disabled={isSubmitting}>
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
  const activeTab = query.get("tab") || "generate";
  const [mode, setMode] = useState(requestedMode);

  useEffect(() => {
    setMode(requestedMode);
  }, [requestedMode]);

  return (
    <AppShell active={activeTab === "generate" ? (mode === "deep" ? "Deep Mode" : "Generate Test") : dashboardTabLabel(activeTab)} navigate={navigate}>
      <div className="dashboard-grid">
        <section className="main-panel">
          <div className="dashboard-header">
            <div>
              <h1>{activeTab === "generate" ? "Generate Test" : dashboardTabLabel(activeTab)}</h1>
              <p>{activeTab === "generate" ? "Create custom tests in seconds and improve your learning." : "Everything here is clickable now, so the dashboard feels alive."}</p>
            </div>
            <button className="button button-yellow" onClick={() => navigate("/#how-it-works")}>
              <CircleHelp size={19} />
              How it works?
            </button>
          </div>

          {activeTab === "generate" ? (
            <>
              <div className="mode-tabs" role="tablist" aria-label="Test generation modes">
                <button
                  className={mode === "quick" ? "active" : ""}
                  onClick={() => {
                    setMode("quick");
                    navigate("/dashboard?tab=generate&mode=quick");
                  }}
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
                  onClick={() => {
                    setMode("deep");
                    navigate("/dashboard?tab=generate&mode=deep");
                  }}
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
            </>
          ) : (
            <DashboardTabPanel tab={activeTab} navigate={navigate} />
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

function LoadingPage() {
  return (
    <main className="login-page">
      <section className="auth-card">
        <h2>Opening your dashboard...</h2>
        <p>Securing your session and loading StudyX.</p>
      </section>
    </main>
  );
}

function dashboardTabLabel(tab) {
  const labels = {
    home: "Dashboard",
    tests: "My Tests",
    results: "Results",
    tutor: "AI Tutor",
    bookmarks: "Bookmarks",
    downloads: "Downloads",
    material: "Study Material",
    settings: "Settings",
  };

  return labels[tab] || "Dashboard";
}

function DashboardTabPanel({ tab, navigate }) {
  const panels = {
    home: {
      icon: LayoutDashboard,
      title: "Study Overview",
      body: "Track your streak, continue recent papers, or jump straight into a fresh generated test.",
      action: "Generate Test",
      to: "/dashboard?tab=generate&mode=quick",
    },
    tests: {
      icon: ClipboardList,
      title: "Saved Tests",
      body: "Your generated papers and recent attempts are ready from here.",
      action: "Start Latest Test",
      to: "/test",
    },
    results: {
      icon: BarChart3,
      title: "Performance Results",
      body: "Open the latest report with marks, answer key, explanations, and weak-topic guidance.",
      action: "Open Results",
      to: "/review",
    },
    tutor: {
      icon: Sparkles,
      title: "AI Tutor",
      body: "Ask Gemini for concepts, hints, revision plans, or detailed explanations.",
      action: "Generate Practice Paper",
      to: "/dashboard?tab=generate&mode=quick",
    },
    bookmarks: {
      icon: Bookmark,
      title: "Bookmarks",
      body: "Questions you mark during tests will appear here for quick revision.",
      action: "Go to Test",
      to: "/test",
    },
    downloads: {
      icon: Download,
      title: "Downloads",
      body: "Reports and generated papers can be collected here after export.",
      action: "View Report",
      to: "/review",
    },
    material: {
      icon: FileText,
      title: "Study Material",
      body: "Upload chapters and turn them into quick practice sets.",
      action: "Upload Chapter",
      to: "/dashboard?tab=generate&mode=quick&source=upload",
    },
    settings: {
      icon: Settings,
      title: "Settings",
      body: "Account preferences, notifications, and learning defaults will live here.",
      action: "Back to Dashboard",
      to: "/dashboard?tab=home",
    },
  };
  const panel = panels[tab] || panels.home;
  const Icon = panel.icon;

  return (
    <div className="tab-panel">
      <IconBadge icon={Icon} tone="purple" />
      <h2>{panel.title}</h2>
      <p>{panel.body}</p>
      {tab === "tests" && <RecentTests />}
      {tab === "tutor" && <AiTutorPanel />}
      <PrimaryButton onClick={() => navigate(panel.to)}>{panel.action}</PrimaryButton>
    </div>
  );
}

function QuickModeForm({ navigate, initialSource = "topic" }) {
  const [source, setSource] = useState(initialSource);
  const [chapterFile, setChapterFile] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [counts, setCounts] = useState({ mcq: 20, qa: 10, fill: 10, trueFalse: 10 });
  const [generationState, setGenerationState] = useState({ loading: false, error: "" });

  useEffect(() => {
    setSource(initialSource);
  }, [initialSource]);

  const questionTypes = [
    { key: "mcq", label: "MCQ", icon: FileQuestion, tone: "yellow" },
    { key: "qa", label: "Q&A", icon: MessageSquareText, tone: "green" },
    { key: "fill", label: "Fill in the Blanks", icon: ListChecks, tone: "pink" },
    { key: "trueFalse", label: "True / False", icon: CheckCircle2, tone: "purple" },
  ];

  const handleGenerate = async () => {
    setGenerationState({ loading: true, error: "" });

    try {
      const generatedTest = await generateStudyTest({
        mode: "quick",
        topic: source === "upload" ? chapterFile || topic || "Uploaded chapter" : topic,
        difficulty,
        counts,
        context: source === "upload" ? `Student uploaded: ${chapterFile || "chapter PDF"}` : "",
      });

      localStorage.setItem("studyHubGeneratedTest", JSON.stringify(generatedTest));
      navigate("/test");
    } catch (error) {
      setGenerationState({ loading: false, error: error.message });
    }
  };

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
              <input
                placeholder="e.g. Photosynthesis in Plants"
                aria-label="Topic or chapter name"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
              />
            </span>
          </div>
          <span className="or-chip">or</span>
          <label
            className={`source-option ${source === "upload" ? "active" : ""}`}
            onClick={() => setSource("upload")}
          >
            <Upload size={38} />
            <span>
              <strong>Upload PDF</strong>
              <small>{chapterFile || "Choose your chapter PDF"}</small>
              <input
                className="visually-hidden"
                type="file"
                accept="application/pdf,.pdf"
                aria-label="Upload chapter PDF"
                onChange={(event) => {
                  setSource("upload");
                  setChapterFile(event.target.files?.[0]?.name || "");
                }}
              />
            </span>
          </label>
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
              <input
                type="number"
                value={counts[item.key]}
                min="0"
                aria-label={`${item.label} count`}
                onChange={(event) =>
                  setCounts((current) => ({ ...current, [item.key]: Math.max(0, Number(event.target.value)) }))
                }
              />
            </label>
          ))}
        </div>
      </section>

      <section className="form-section">
        <h2>3. Select Difficulty Level</h2>
        <div className="difficulty-row">
          {["Easy", "Medium", "Hard", "Mixed"].map((item) => (
            <button
              className={difficulty === item ? "selected" : ""}
              key={item}
              onClick={() => setDifficulty(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {generationState.error && <p className="generation-error">{generationState.error}</p>}
      <PrimaryButton
        className="generate-button"
        onClick={handleGenerate}
        icon={ArrowRight}
        disabled={generationState.loading}
      >
        {generationState.loading ? "Generating..." : "Generate Question Paper"}
      </PrimaryButton>
    </div>
  );
}

function DeepModeForm({ navigate }) {
  const [examContext, setExamContext] = useState({
    course: "BCA",
    subject: "Mathematics",
    topic: "Matrix",
    reference: "Last 5 Years",
  });
  const [generationState, setGenerationState] = useState({ loading: false, error: "" });

  const updateContext = (field) => (event) => {
    setExamContext((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleGenerate = async () => {
    setGenerationState({ loading: true, error: "" });

    try {
      const generatedTest = await generateStudyTest({
        mode: "deep",
        topic: `${examContext.course} ${examContext.subject} - ${examContext.topic}`,
        difficulty: "Mixed",
        counts: { mcq: 20, qa: 10, fill: 5, trueFalse: 5 },
        context: `Analyze ${examContext.reference} exam style and make the paper pattern-focused.`,
      });

      localStorage.setItem("studyHubGeneratedTest", JSON.stringify(generatedTest));
      navigate("/test");
    } catch (error) {
      setGenerationState({ loading: false, error: error.message });
    }
  };

  return (
    <div className="builder-card deep-builder">
      <div className="deep-mode-layout">
        <section className="form-section deep-config-panel">
          <h2>1. Choose Exam Context</h2>
          <div className="deep-grid">
            <SelectLike icon={GraduationIcon} label="Course" value={examContext.course} onChange={updateContext("course")} options={["BCA", "B.Tech", "B.Sc", "MCA"]} />
            <SelectLike icon={BookOpenIcon} label="Subject" value={examContext.subject} onChange={updateContext("subject")} options={["Mathematics", "Physics", "Chemistry", "Computer Networks"]} />
            <SelectLike icon={NotebookIcon} label="Topic / Chapter" value={examContext.topic} onChange={updateContext("topic")} options={["Matrix", "Determinants", "Vectors", "Linear Equations"]} />
            <SelectLike icon={ClockIcon} label="Paper Reference" value={examContext.reference} onChange={updateContext("reference")} options={["Last 5 Years", "Last 10 Years", "Latest Syllabus", "Mixed Pattern"]} />
          </div>
        </section>

        <section className="form-section deep-analysis-panel">
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

          <section className="trend-panel">
            <div>
              <span className="tag tag-green">AUTO-READY PAPER</span>
              <h3>{examContext.course} {examContext.subject} - {examContext.topic}</h3>
              <p>
                Expected weight: 14 marks. High-repeat concepts: inverse matrix, determinants,
                rank, and linear equations.
              </p>
            </div>
            <div className="trend-bars" aria-label="Chapter importance">
              {[examContext.topic, "Determinants", "Vectors"].map((label, index) => (
                <div key={label}>
                  <span>{label}</span>
                  <b style={{ width: ["92%", "74%", "48%"][index] }} />
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>

      {generationState.error && <p className="generation-error">{generationState.error}</p>}
      <PrimaryButton
        className="generate-button"
        onClick={handleGenerate}
        icon={ArrowRight}
        disabled={generationState.loading}
      >
        {generationState.loading ? "Generating..." : "Generate Exam Pattern Paper"}
      </PrimaryButton>
    </div>
  );
}

function SelectLike({ icon: Icon, label, value, options = [], onChange }) {
  return (
    <label className="select-like">
      <Icon size={24} />
      <span>
        <small>{label}</small>
        <select value={value} onChange={onChange} aria-label={label}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </span>
      <ChevronDown size={20} />
    </label>
  );
}

function AppShell({ children, active, navigate }) {
  const [authUser, setAuthUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const userName =
    authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || authUser?.email?.split("@")[0] || "Student";
  const userEmail = authUser?.email || "Not signed in";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    let activeSession = true;

    supabase.auth.getUser().then(({ data }) => {
      if (activeSession) {
        setAuthUser(data.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
    });

    return () => {
      activeSession = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navItems = [
    [LayoutDashboard, "Dashboard", "/dashboard?tab=home"],
    [Plus, "Generate Test", "/dashboard?tab=generate&mode=quick"],
    [Brain, "Deep Mode", "/dashboard?tab=generate&mode=deep", "NEW"],
    [ClipboardList, "My Tests", "/dashboard?tab=tests"],
    [BarChart3, "Results", "/dashboard?tab=results"],
  ];

  return (
    <div className="shell">
      <aside className="sidebar">
        <Brand compact />
        <div className="sidebar-account" aria-label="Logged in account">
          <span className="account-avatar">{userInitial}</span>
          <div>
            <strong>{userName}</strong>
            <span>
              <Mail size={15} />
              {userEmail}
            </span>
          </div>
        </div>
        <nav className="side-nav" aria-label="Dashboard navigation">
          {navItems.map(([Icon, label, to, badge]) => (
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
          <button className="logout-nav" onClick={handleLogout}>
            <LogOut size={22} />
            <span>Logout</span>
          </button>
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
            <button
              className="profile-button"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((isOpen) => !isOpen)}
            >
              <span>{userInitial}</span>
              Hi, {userName}!
              <ChevronDown size={17} />
            </button>
            {profileOpen && (
              <div className="profile-menu" role="menu">
                <strong>{userName}</strong>
                <small>{userEmail}</small>
                <button role="menuitem" onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function UploadCard({ navigate }) {
  const [quickFile, setQuickFile] = useState("");

  return (
    <article className="upload-card">
      <h3>
        <Upload size={20} />
        Quick Upload
      </h3>
      <p>Upload chapter PDF and get instant test</p>
      <label>
        <Upload size={22} />
        <strong>Upload PDF</strong>
        <span>{quickFile || "or drag and drop here"}</span>
        <input
          className="visually-hidden"
          type="file"
          accept="application/pdf,.pdf"
          aria-label="Quick upload PDF"
          onChange={(event) => {
            setQuickFile(event.target.files?.[0]?.name || "");
            navigate("/dashboard?tab=generate&mode=quick&source=upload");
          }}
        />
      </label>
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
  const generatedTest = useMemo(() => readGeneratedTest(), []);
  const testData = useMemo(() => buildTestData(generatedTest), [generatedTest]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewMarks, setReviewMarks] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const currentQuestion = testData.questions[currentIndex];
  const selectedAnswer = answers[currentQuestion.id] || "";
  const progress = Math.round(((currentIndex + 1) / testData.questions.length) * 100);
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const correctCount = testData.questions.filter((question) => isCorrectAnswer(answers[question.id], question.answer)).length;
  const wrongCount = testData.questions.length - correctCount;
  const scorePercent = Math.round((correctCount / testData.questions.length) * 100);

  const goToQuestion = (index) => {
    setShowSummary(false);
    setCurrentIndex(index);
  };

  const goPrevious = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const goNext = () => {
    if (currentIndex === testData.questions.length - 1) {
      setShowSummary(true);
      return;
    }
    setCurrentIndex((index) => Math.min(testData.questions.length - 1, index + 1));
  };

  const updateAnswer = (value) => {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: value }));
  };

  const handleSubmitTest = () => {
    saveLatestResult({ testData, answers });
    setShowSummary(true);
  };

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
          <strong>{showSummary ? "Summary" : `Question ${currentIndex + 1} of ${testData.questions.length}`}</strong>
          <span>{progress}%</span>
          <div>
            <b style={{ width: `${progress}%` }} />
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
          <button className="button button-pink" onClick={handleSubmitTest}>
            <Upload size={20} />
            Submit Test
          </button>
        </div>
      </header>

      <div className="test-layout">
        <aside className="question-sidebar">
          <span className="tag tag-yellow">SECTIONS</span>
          {getTestSections(testData.questions, answers).map((section) => (
            <button className={currentQuestion.type === section.label ? "active" : ""} key={section.label}>
              <span>{section.label} ({section.count})</span>
              <b>{section.answered}/{section.count}</b>
            </button>
          ))}
          <span className="tag tag-yellow">QUESTION NAVIGATION</span>
          <div className="question-grid" aria-label="Question navigation">
            {testData.questions.map((question, index) => (
              <button
                key={question.id}
                className={`${index === currentIndex && !showSummary ? "current" : ""} ${answers[question.id] ? "answered" : ""} ${reviewMarks[question.id] ? "review" : ""}`}
                onClick={() => goToQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="legend-row">
            <span><i className="answered" /> Answered</span>
            <span><i className="review" /> Review</span>
            <span><i /> Not Answered</span>
          </div>
          <button className="button button-ghost prev-section" onClick={goPrevious} disabled={currentIndex === 0}>
            <ArrowLeft size={20} />
            Previous
          </button>
        </aside>

        {showSummary ? (
          <section className="question-panel answer-summary-panel">
            <header>
              <span className="question-type">RESULT</span>
              <strong>Test Result</strong>
              <div className="marks">
                Score:
                <b>{scorePercent}%</b>
              </div>
            </header>
            <div className="answer-summary-list">
              <section className="summary-score-card">
                <div>
                  <span>Total Questions</span>
                  <strong>{testData.questions.length}</strong>
                </div>
                <div>
                  <span>Correct</span>
                  <strong>{correctCount}</strong>
                </div>
                <div>
                  <span>Wrong</span>
                  <strong>{wrongCount}</strong>
                </div>
                <div>
                  <span>Score</span>
                  <strong>{scorePercent}%</strong>
                </div>
              </section>
              {testData.questions.map((question, index) => {
                const selected = answers[question.id] || "Not answered";
                const isCorrect = isCorrectAnswer(selected, question.answer);

                return (
                  <article className={isCorrect ? "correct" : "incorrect"} key={question.id}>
                    <strong>Q{index + 1}</strong>
                    <div>
                      <p>{question.question}</p>
                      <span>Your answer: <b>{selected}</b></span>
                      <span>Correct answer: <b>{question.answer || "Not provided"}</b></span>
                      {!isCorrect && (
                        <em>
                          Reason: {question.explanation || "Review the concept and compare your answer with the correct answer."}
                        </em>
                      )}
                    </div>
                    {isCorrect ? <Check size={20} /> : <X size={20} />}
                  </article>
                );
              })}
            </div>
            <footer>
              <button className="button button-ghost" onClick={() => setShowSummary(false)}>
                <ArrowLeft size={20} />
                Back to Paper
              </button>
              <button className="button button-primary" onClick={() => navigate("/dashboard?tab=home")}>
                Dashboard
                <ArrowRight size={20} />
              </button>
            </footer>
          </section>
        ) : (
          <section className="question-panel">
            <header>
              <span className="question-type">{currentQuestion.type}</span>
              <strong>{currentQuestion.type} Question</strong>
              <div className="marks">
                Marks:
                <b>+{currentQuestion.marks}</b>
                <em>-0</em>
              </div>
              <button aria-label="Bookmark question">
                <Bookmark size={22} />
              </button>
            </header>
            <div className="question-body">
              <h1>{currentQuestion.question}</h1>
              {currentQuestion.diagram && (
                <div className="formula-line" aria-label="Question molecule diagram">
                  <span>H<sub>3</sub>C</span>
                  <i />
                  <span>CH<sub>2</sub></span>
                  <i />
                  <span>CH<sub>2</sub></span>
                  <i />
                  <span>COOH</span>
                </div>
              )}
              {currentQuestion.options.length ? (
                <div className="option-list">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      className={selectedAnswer === option ? "selected" : ""}
                      key={option}
                      onClick={() => updateAnswer(option)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <label className="written-answer">
                  <span>Your Answer</span>
                  <textarea
                    value={selectedAnswer}
                    onChange={(event) => updateAnswer(event.target.value)}
                    placeholder="Type your answer here..."
                    aria-label="Written answer"
                  />
                </label>
              )}
              <label className="review-check">
                <input
                  type="checkbox"
                  checked={Boolean(reviewMarks[currentQuestion.id])}
                  onChange={(event) =>
                    setReviewMarks((current) => ({ ...current, [currentQuestion.id]: event.target.checked }))
                  }
                />
                Mark for Review
              </label>
            </div>
            <footer>
              <button className="button button-ghost" onClick={goPrevious} disabled={currentIndex === 0}>
                <ArrowLeft size={20} />
                Previous
              </button>
              <button className="button button-pink" onClick={handleSubmitTest}>
                <Upload size={20} />
                Submit Test
              </button>
              <button className="button button-primary" onClick={goNext}>
                {currentIndex === testData.questions.length - 1 ? "Finish" : "Next"}
                <ArrowRight size={20} />
              </button>
            </footer>
          </section>
        )}
      </div>

      <footer className="test-footer">
        <span><b>Test Name:</b> {testData.title}</span>
        <span><b>Difficulty:</b> <mark>{testData.difficulty}</mark></span>
        <span><b>Total Marks:</b> {testData.totalMarks}</span>
        <span><b>Answered:</b> {answeredCount}/{testData.questions.length}</span>
        <button className="button button-yellow" onClick={handleSubmitTest}>
          <Upload size={20} />
          {showSummary ? "Result Shown" : "Submit Test"}
        </button>
      </footer>
    </main>
  );
}

function readGeneratedTest() {
  try {
    return JSON.parse(localStorage.getItem("studyHubGeneratedTest"));
  } catch {
    return null;
  }
}

function saveLatestResult({ testData, answers }) {
  const questions = testData.questions.map((question, index) => {
    const selected = answers[question.id] || "";
    const isCorrect = isCorrectAnswer(selected, question.answer);

    return {
      ...question,
      index: index + 1,
      selected,
      status: selected ? (isCorrect ? "correct" : "incorrect") : "skipped",
    };
  });
  const correct = questions.filter((question) => question.status === "correct").length;
  const incorrect = questions.filter((question) => question.status === "incorrect").length;
  const skipped = questions.filter((question) => question.status === "skipped").length;

  localStorage.setItem(
    "studyHubLatestResult",
    JSON.stringify({
      ...testData,
      submittedAt: new Date().toISOString(),
      correct,
      incorrect,
      skipped,
      answered: correct + incorrect,
      percentage: Math.round((correct / questions.length) * 100),
      questions,
    }),
  );
}

function readLatestResult() {
  try {
    return JSON.parse(localStorage.getItem("studyHubLatestResult"));
  } catch {
    return null;
  }
}

function buildTestData(generatedTest) {
  if (generatedTest?.questions?.length) {
    return {
      title: generatedTest.title || "Generated Practice Paper",
      difficulty: generatedTest.difficulty || "Medium",
      totalMarks: generatedTest.totalMarks || 100,
      questions: generatedTest.questions.map((question, index) => ({
        id: String(question.id || index + 1),
        type: question.type || "MCQ",
        question: question.question || "Generated question",
        options: Array.isArray(question.options) ? question.options : [],
        answer: question.answer || "",
        explanation: question.explanation || "",
        marks: question.marks || 2.5,
      })),
    };
  }

  return {
    title: "Organic Chemistry - Carboxylic Acids",
    difficulty: "Medium",
    totalMarks: 100,
    questions: [
      {
        id: "1",
        type: testQuestion.type,
        question: testQuestion.title,
        options: testQuestion.options.map((option) => option.label),
        answer: "Butanoic acid",
        explanation: "The parent chain includes the carboxyl carbon, so four carbons gives butanoic acid.",
        marks: 2.5,
        diagram: true,
      },
      {
        id: "2",
        type: "MCQ",
        question: "The pKa value of acetic acid is approximately:",
        options: ["1.76", "3.75", "4.76", "5.76"],
        answer: "4.76",
        explanation: "Acetic acid is a weak acid and its standard pKa is close to 4.76.",
        marks: 2.5,
      },
      {
        id: "3",
        type: "Fill in the Blanks",
        question: "The general formula of alkane is ________.",
        options: [],
        answer: "CnH2n+2",
        explanation: "Alkanes are saturated hydrocarbons with only single bonds, giving the formula CnH2n+2.",
        marks: 2.5,
      },
      {
        id: "4",
        type: "True / False",
        question: "Glucose is a monosaccharide.",
        options: ["True", "False"],
        answer: "True",
        explanation: "Glucose is a simple sugar and belongs to the monosaccharide group.",
        marks: 2.5,
      },
    ],
  };
}

function getTestSections(questions, answers) {
  const sectionMap = questions.reduce((map, question) => {
    const section = map.get(question.type) || { label: question.type, count: 0, answered: 0 };
    section.count += 1;
    if (answers[question.id]) section.answered += 1;
    map.set(question.type, section);
    return map;
  }, new Map());

  return Array.from(sectionMap.values());
}

function isCorrectAnswer(selectedAnswer, correctAnswer) {
  if (!selectedAnswer || !correctAnswer) return false;
  return normalizeAnswer(selectedAnswer) === normalizeAnswer(correctAnswer);
}

function normalizeAnswer(answer) {
  return String(answer).trim().toLowerCase().replace(/\s+/g, " ");
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
  const latestResult = useMemo(() => readLatestResult(), []);
  const reviewData = latestResult || buildFallbackReviewData();
  const reviewQuestionRows = reviewData.questions.map((question) => ({
    id: `Q.${question.index}`,
    type: question.type,
    status: question.status,
    question: question.question,
    marks: question.status === "correct" ? `+${question.marks} Marks` : question.status === "skipped" ? "Skipped" : "0 Marks",
  }));

  return (
    <div className="review-shell">
      <aside className="sidebar review-sidebar">
        <Brand compact />
        <nav className="side-nav" aria-label="Results navigation">
          {[
            [LayoutDashboard, "Dashboard", "/dashboard?tab=home"],
            [Plus, "Generate Test", "/dashboard?tab=generate&mode=quick"],
            [Brain, "Deep Mode", "/dashboard?tab=generate&mode=deep", "NEW"],
            [ClipboardList, "My Tests", "/dashboard?tab=tests"],
            [BarChart3, "Results", "/review"],
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
            <p>{reviewData.title} result stored in this browser.</p>
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
            <button className="button button-primary" onClick={() => navigate("/dashboard?tab=home")}>
              <Home size={20} />
              Go to Dashboard
            </button>
          </div>
        </header>

        <div className="review-content">
          <section className="review-left">
            <div className="result-stats">
              {[
                { label: "Total Marks", value: reviewData.totalMarks, tone: "green" },
                { label: "Score", value: `${reviewData.percentage}%`, tone: "yellow" },
                { label: "Correct Answers", value: `${reviewData.correct} / ${reviewData.questions.length}`, tone: "green" },
                { label: "Wrong Answers", value: `${reviewData.incorrect} / ${reviewData.questions.length}`, tone: "pink" },
                { label: "Skipped", value: `${reviewData.skipped} / ${reviewData.questions.length}`, tone: "blue" },
              ].map((stat) => (
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
                    <strong>{reviewData.percentage}%</strong>
                    Score
                  </span>
                </div>
                <div className="donut-legend">
                  <span><i className="good" /> Correct {reviewData.correct}</span>
                  <span><i className="bad" /> Incorrect {reviewData.incorrect}</span>
                  <span><i className="skip" /> Skipped {reviewData.skipped}</span>
                </div>
              </div>
              <div className="section-performance">
                <h2>Section Wise Performance</h2>
                {buildSectionPerformance(reviewData.questions).map((item) => (
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
                {reviewData.questions.map((item) => (
                  <article key={item.id}>
                    <strong>Q.{item.index}</strong>
                    <span>{item.answer || "Not provided"}</span>
                    <p>{item.explanation || "Reason not available for this generated question."}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="test-object-card">
              <header>
                <h2>Saved Test Project Object</h2>
                <span className="tag tag-yellow">BROWSER SAVED</span>
              </header>
              <pre>{JSON.stringify(buildReviewProjectObject(reviewData), null, 2)}</pre>
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
                {reviewQuestionRows.map((question) => (
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
                <h3>Latest browser result</h3>
                <p>{latestResult ? "This report is loaded from the test you submitted in this browser." : "No saved browser result found, so sample data is shown."}</p>
              </div>
              <button className="button button-ghost" onClick={() => navigate("/test")}>
                Open Test
                <ArrowRight size={20} />
              </button>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}

function buildFallbackReviewData() {
  const questions = questionReviews.map((question, index) => {
    const key = answerKey[index] || answerKey[0];

    return {
      id: String(index + 1),
      index: index + 1,
      type: question.type,
      status: question.status,
      question: question.question,
      selected: question.status === "skipped" ? "" : question.status === "correct" ? key.answer : "Wrong answer",
      answer: key.answer,
      explanation: key.reason,
      marks: question.status === "correct" ? 2.5 : 0,
    };
  });
  const correct = questions.filter((question) => question.status === "correct").length;
  const incorrect = questions.filter((question) => question.status === "incorrect").length;
  const skipped = questions.filter((question) => question.status === "skipped").length;

  return {
    title: "Organic Chemistry - Carboxylic Acids",
    totalMarks: 100,
    percentage: 78,
    correct,
    incorrect,
    skipped,
    questions,
  };
}

function buildSectionPerformance(questions) {
  const sectionsByType = questions.reduce((map, question) => {
    const section = map.get(question.type) || { label: question.type, total: 0, correct: 0 };
    section.total += 1;
    if (question.status === "correct") section.correct += 1;
    map.set(question.type, section);
    return map;
  }, new Map());

  return Array.from(sectionsByType.values()).map((section) => ({
    label: `${section.label} (${section.total})`,
    value: `${section.correct} / ${section.total}`,
    width: `${Math.round((section.correct / section.total) * 100)}%`,
  }));
}

function buildReviewProjectObject(reviewData) {
  return {
    project: "Study Hub Test Review",
    testSet: {
      status: "submitted",
      title: reviewData.title,
      totalMarks: reviewData.totalMarks,
      submittedAt: reviewData.submittedAt || "sample-result",
    },
    result: {
      scorePercent: reviewData.percentage,
      totalQuestions: reviewData.questions.length,
      correct: reviewData.correct,
      wrong: reviewData.incorrect,
      skipped: reviewData.skipped,
    },
    questions: reviewData.questions.map((question) => ({
      questionNo: question.index,
      type: question.type,
      selectedAnswer: question.selected || "Not answered",
      correctAnswer: question.answer || "Not provided",
      status: question.status,
      reason: question.explanation || "Reason not available.",
    })),
  };
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
