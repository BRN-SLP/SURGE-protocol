@AGENTS.md

# Wiki

**При старте** сначала спроси: "Над чем работаем — SURGE Protocol, другой проект, или задача вне проекта?"

Только если ответ касается SURGE — читай `~/knowledge/surge/wiki/hot.md` (контекст, открытые задачи, решения).

**Обновляй hot.md** после значимых задач, при `/clear`, или в конце сессии.

Схема wiki: `~/knowledge/surge/CLAUDE.md`
Services registry: `~/knowledge/surge/SERVICES.md`

---

# SURGE Protocol — рабочий контекст

## Проект

Next.js приложение, деплоится на `surge-app.vercel.app` через `vercel --prod --yes`.
Живой домен `surge-protocol.xyz` пока указывает на старый проект (indigo-дизайн) — не трогать.

## Референсы дизайна (Stitch-экспорт, финальные)

- **L1** — https://output-opal-eta.vercel.app/L1.html — Hero секция с картой
- **L2** — https://output-opal-eta.vercel.app/L2.html — Problem + HowItWorks секции
- **DR1** — https://output-opal-eta.vercel.app/DR1.html — Drops Hub (отдельная страница)

Это эталон. При любых изменениях сверяться с этими страницами.

## Дизайн-принципы (зафиксировано)

- Фон: `#0e0e0e`, поверхности: `#141414`, `#2a2a2a`
- Акцент: `#dc3333` — используется очень редко, как момент-сюрприз (тонкая линия, hover)
- Шрифт: Roboto Condensed везде, `font-weight: 300`
- Углы: `--radius-sm: 10px` — стандарт для всех карточек/контейнеров. ВСЕГДА использовать `var(--radius-sm)` или `var(--radius-md)`, никогда не хардкодить px. Исключения: IdentityCard (16/15px — conic-gradient border effect), pill-прогресс-бары (99px — капсула).
- Никакого glassmorphism, никаких градиентных заливок, никакого декоративного шума
- Анимации: GSAP, purposeful, subtle

## Цветовые токены (globals.css — не менять)

```
--bg: #0e0e0e
--surface: #141414
--surface-2: #353534
--text: #f5f5f5
--text-muted: #aaaaaa
--border: #2a2a2a
--accent: #dc3333
--section-px: clamp(1.5rem, 5vw, 5rem)
```

## Статус компонентов

### ✅ Готово и совпадает с референсом

- Navbar — структура, цвета, hover-эффекты, active-underline
- SurgeLogo — `<img>` с theme-switching (dark/light SVG из `/public/`)
- AnimatedBorder — 10 вариантов SVG-анимаций (из L2, точное соответствие)
- ProblemSection — структура карточек, тексты, AnimatedBorder на hover
- Цветовые токены и шрифт

### ✅ Исправлено (ранее было расхождение)

**Hero (HeroSection.tsx):**

- `md:pl-12 lg:pl-20` — добавлено
- `animate-bob` loop + spinning conic-gradient border — реализовано; `interactive={false}` чтобы не конфликтовал с bob
- Кнопка "Initialize Protocol": `font-bold` — добавлено

**ProblemSection.tsx:**

- Material Symbols иконки (key, terminal), 48px — реализовано
- `max-w-7xl mx-auto` — добавлено

### ✅ Реализовано

- HowItWorksSection — шаги 01–07
- ScoreCalculator
- FinalCTA
- Drops страница (`/drops`) — DropsHub компонент

## Логика карточки идентичности (L1)

```css
/* Вращающийся бордер */
.id-card-outer {
  border-radius: 16px;
  padding: 1px;
  overflow: hidden;
  width: 340px;
}
.id-card-outer::before {
  content: "";
  position: absolute;
  inset: -80%;
  width: 260%;
  height: 260%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    transparent 260deg,
    #ca5454 300deg,
    #f5f5f5 340deg,
    transparent 360deg
  );
  animation: border-spin 5s linear infinite;
}
.id-card-inner {
  border-radius: 15px;
  background: #141414;
  padding: 28px;
}

/* Непрерывный 3D-тилт */
@keyframes depth-tilt {
  0% {
    transform: perspective(900px) rotateX(3deg) rotateY(-4deg) translateZ(0px);
  }
  25% {
    transform: perspective(900px) rotateX(-2deg) rotateY(3deg) translateZ(10px);
  }
  50% {
    transform: perspective(900px) rotateX(4deg) rotateY(2deg) translateZ(6px);
  }
  75% {
    transform: perspective(900px) rotateX(-1deg) rotateY(-3deg) translateZ(12px);
  }
  100% {
    transform: perspective(900px) rotateX(3deg) rotateY(-4deg) translateZ(0px);
  }
}
/* Применяется как класс animate-bob */
```

## Деплой

```bash
vercel --prod --yes
```
