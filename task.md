# Task Log — Admin Panel

## Контекст

Репозиторий `Admin` — фронтенд админ-панели, описанный в `claude.md`. Потребляет
REST API репозитория `Server` (телемедицинская платформа).

## Что было сделано

### 1. Разведка реального API перед версткой

Перед написанием кода прочитан фактический код `Server` (роуты, Zod-валидаторы,
`schema.prisma`), а не только `claude.md` — спека и реализация местами
расходятся:

- **Нет серверной пагинации/поиска/фильтров** ни на одном list-эндпоинте
  (`/api/admin/users|doctors|patients|appointments|articles|sports`) — все
  `findMany()` без `skip/take/where(search)`. Поиск, фильтры и пагинация в
  таблицах реализованы полностью на клиенте (`DataTable` + `usePagination`).
- Блокировка пользователя — это `PUT /api/admin/users/:id/status` с телом
  `{ isActive: boolean }`. Отдельного enum-статуса на `User` нет.
- `GET /api/admin/categories` не существует (только `POST/PUT/DELETE`) — список
  категорий берётся с публичного `GET /api/categories`.
- `Sport.category` — свободная строка, не связь с моделью `Category`.
- Нет отдельного аналитического эндпоинта для графиков дашборда — `Users
  Growth`/`Patients Growth`/`Appointments by Status`/`Doctors by
  Specialization` считаются на клиенте агрегацией списков (`createdAt`,
  `status`, `specialization`) за отсутствием time-series API.
- `POST /api/admin/doctors` создаёт `User`+`Doctor` одним запросом (плоские
  поля `fullName/email/password/specialization/...`), отдельный `userId` от
  клиента не нужен.
- `GET /api/admin/patients` не включает связь `user` — поле "Status" в таблице
  пациентов рассчитано на этот случай (падает на `—`, если `user` отсутствует
  в ответе).

### 2. Стек и версии

React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Axios, TanStack Query v5,
React Hook Form + Zod (Zod 3 — та же мажорная версия, что и на `Server`),
Recharts 2, Lucide React, react-hot-toast.

- `react-router-dom` обновлён с `^6.26` до `^7.18` после `npm audit`: 6.x ветка
  (вплоть до последней 6.30.4) уязвима к open-redirect через `<Link>`/
  `useNavigate` (GHSA-wrjc-x8rr-h8h6) — патч есть только в 7.x. Использованы
  только "declarative mode" API (`BrowserRouter`, `Routes`, `Route`,
  `Navigate`, `Outlet`, `NavLink`, `useNavigate`, `useLocation`), совместимые
  между 6 и 7 без миграции на data router.
- `vite`/`esbuild` оставлены на 5.x/0.24.x — фикс уязвимости dev-сервера
  (GHSA-67mh-4wv8-2f99, только доступ с постороннего сайта к dev-серверу)
  требует Vite 8 (breaking). Риск низкий (только `npm run dev` на локальной
  машине), решили не тянуть непроверенный мажор — та же логика, что и с
  Express 5/Zod 4/Prisma 7 на `Server`.

### 3. Структура

Реализована структура из `claude.md` (`components/{ui,dashboard→charts в
Dashboard-page,users,doctors,patients,appointments,articles,sports,categories}`,
`pages/*`, `layouts/{AuthLayout,AdminLayout}`, `services/*.service.ts`,
`hooks/*`, `types/index.ts`, `routes/*`, `utils/*`) плюс `context/AuthContext.tsx`
(не было в спеке, но необходим для состояния авторизации).

**Страницы:** Login, Dashboard (6 stat-карт + 4 графика), Users (поиск, фильтр
по роли, view/block-unblock/delete), Doctors (CRUD с модалкой создания
User+Doctor), Patients (список, возраст из `birthDate`, доктор — по последнему
appointment), Appointments (read-only, фильтры Doctor/Status/Date — CRUD для
appointments у admin в API нет), Articles (CRUD, publish/unpublish по клику на
бейдж), Sports (CRUD), Categories (CRUD; поле "Type" из спеки не реализовано —
его нет в модели `Category` на бэкенде), Settings (профиль + logout).

**Auth:** JWT в `localStorage`, axios-интерсептор добавляет
`Authorization: Bearer`, 401 → чистит токен и редиректит на `/login`.
`ProtectedRoute` (есть ли валидная сессия) + `AdminRoute` (`role === 'ADMIN'`,
иначе `/access-denied`) — как и требовала спека.

**Переиспользуемые UI-компоненты:** Button, FormInput, FormTextarea, Select,
Badge, Modal, ConfirmDialog, SearchInput, FilterDropdown, DataTable (с
клиентской сортировкой/пагинацией/skeleton/empty/error state), Pagination,
StatCard, ChartCard, EmptyState, ErrorState — все из чек-листа spec §16, кроме
Toast (заменён на `react-hot-toast`, не самописный компонент).

### 4. Проверка

- `npm run build` (`tsc -b && vite build`) — без ошибок.
- `npm run lint` — 0 ошибок, 1 безобидный react-refresh warning
  (`AuthContext.tsx` экспортирует и провайдер, и хук).
- `npm audit` — закрыта react-router уязвимость (6→7), осталась только
  dev-server-only esbuild/vite (см. п.2, осознанно не мажорим).
- Smoke-тест на реальном API: `npm run dev` (порт 5174, совпадает с CORS
  allowlist `Server/.env`), логин админом
  (`admin@healthy.uz`/`Admin123!`) через CORS preflight + сам запрос — 200,
  форма ответа `{ user, token }` совпадает с типами. Все list-эндпоинты,
  которые дёргает фронт (`admin/dashboard|users|doctors|patients|appointments|
  articles|sports`, `categories`) — 200, формы ответов (включая вложенные
  `doctor`/`patient`/`category`) сверены с фактическим JSON и совпадают с
  `src/types/index.ts`.
- **Не проверено визуально в браузере** — расширение Claude in Chrome не было
  подключено в этой сессии, поэтому UI (вёрстка, модалки, графики, responsive)
  проверен только на уровне сборки/типов/API-контракта, не глазами.

### 5. Git

- Репозиторий уже был `git init`-нут (branch `main`, без коммитов), remote
  `origin` уже указывал на `https://github.com/TechVortex-hakaton/Admin`.
- Сделан первый коммит и запушен в `origin/main` (репозиторий был пустым).

## Известные допущения / что стоит уточнить

- Поле "Type" у категорий (из claude.md §13) не реализовано — на бэкенде у
  `Category` нет такого поля.
- Графики на дашборде — клиентская агрегация существующих списков, а не
  реальная time-series аналитика с бэкенда; при большом количестве записей
  это будет дороже, чем серверная агрегация.
- Appointments у admin — read-only (нет `PUT/DELETE` в `/api/admin/appointments`
  API); если нужно менять статус из админки, потребуется либо новый
  admin-эндпоинт на `Server`, либо подтверждение, что admin может использовать
  generic `PUT /api/appointments/:id`.
- UI не тестировался вживую в браузере в этой сессии — стоит открыть
  `http://localhost:5174` и пройтись по разделам глазами перед демо.
