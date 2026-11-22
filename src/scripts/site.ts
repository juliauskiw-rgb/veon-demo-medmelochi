// Small client-side interactions. Everything works and is visible without this file.
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Header: thin line after scrolling. */
const header = document.querySelector<HTMLElement>("[data-header]");
const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Burger (<details>): close on link click and Escape. */
const menu = document.querySelector<HTMLDetailsElement>("[data-menu]");
if (menu) {
  menu.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a")) menu.open = false;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary")?.focus();
    }
  });
}

/* Catalog tabs: highlight one direction in the tray (desktop) / show only it (phones). */
const tablist = document.querySelector<HTMLElement>("[data-tabs]");
const tray = document.querySelector<HTMLElement>("[data-tray]");
if (tablist && tray) {
  tray.setAttribute("role", "tabpanel");
  const tabs = [...tablist.querySelectorAll<HTMLButtonElement>("[role=tab]")];
  const cells = [...tray.querySelectorAll<HTMLElement>(".cell[data-dir]")];
  const select = (tab: HTMLButtonElement, focus = false) => {
    const f = tab.dataset.filter ?? "all";
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    tray.setAttribute("aria-labelledby", tab.id);
    cells.forEach((c) => {
      c.style.setProperty("--reveal-delay", "0ms");
      c.classList.add("is-visible");
      const hit = f === "all" || c.dataset.dir === f;
      c.classList.toggle("is-dim", !hit);
      c.classList.remove("is-hit");
      if (hit && f !== "all" && !reduce) {
        void c.offsetWidth; // restart the edge animation
        c.classList.add("is-hit");
      }
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      let n = -1;
      if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = tabs.length - 1;
      if (n >= 0) {
        e.preventDefault();
        select(tabs[n], true);
      }
    });
  });
}

/* Copy e-mail. */
document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) => {
  const label = btn.textContent ?? "Скопіювати";
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy ?? "");
      btn.textContent = "Скопійовано";
      btn.dataset.done = "";
    } catch {
      btn.textContent = "Не вдалося скопіювати";
    }
    window.setTimeout(() => {
      btn.textContent = label;
      delete btn.dataset.done;
    }, 2400);
  });
});

/* Working hours status, Kyiv time (W-F007): Mon–Fri 09–18, Sat–Sun 09–15. */
const statusEls = document.querySelectorAll<HTMLElement>("[data-hours]");
if (statusEls.length) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Kyiv", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday"));
  const mins = Number(get("hour")) * 60 + Number(get("minute"));
  const closeAt = (d: number) => (d >= 5 ? 15 : 18) * 60;
  const open = mins >= 9 * 60 && mins < closeAt(day);
  let text: string;
  if (open) text = `Зараз працюємо до ${closeAt(day) / 60}:00`;
  else if (mins < 9 * 60) text = "Зараз зачинено, відкриємось сьогодні о 09:00";
  else text = "Зараз зачинено, відкриємось завтра о 09:00";
  statusEls.forEach((el) => {
    const t = el.querySelector("[data-hours-text]");
    if (t) t.textContent = text;
    el.dataset.open = String(open);
    el.hidden = false;
  });
}

/* Phones: bottom call bar after the first screen has left the view. */
const bar = document.querySelector<HTMLElement>("[data-callbar]");
const hero = document.getElementById("hero");
if (bar && hero && "IntersectionObserver" in window) {
  document.documentElement.setAttribute("data-js-callbar", "");
  new IntersectionObserver(([e]) => bar.classList.toggle("is-shown", !e.isIntersecting && e.boundingClientRect.top < 0))
    .observe(hero);
}
