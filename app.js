const asset = (file) => `img/figma/${file}`;

const icons = {
  home: "8283c379-bc9c-48f5-9ef1-003d6c9de541.svg",
  news: "ce1e3756-44ea-48cd-8856-83b3ab98779e.svg",
  meetings: "c94539bf-dd02-4721-8efc-b860d62e3666.svg",
  calendar: "492e477f-7702-4065-ac34-585b6c460454.svg",
  messages: "b1c194ed-af27-4d13-a13a-3b35bfaf1df1.svg",
  notifications: "29dfd07d-c609-4ff3-93e4-71e7708d5487.svg",
  profile: "483443d1-1765-449c-b15f-f7f55a144a74.svg",
  search: "9a437b7b-4188-42a7-bb23-12738529b77e.svg",
  pin: "a866beee-88d5-4e49-98b1-b7a3d8f81bf8.svg",
  clock: "571cc80e-ad49-49e0-95ea-c0ea89fcb754.svg",
  plus: "fa8f4181-8499-46fe-868c-2b93e64b05e6.svg",
  arrow: "a8e4412f-e201-4fd3-8307-759cd04e555e.svg",
  check: "61100473-4c81-4af2-9b2d-0f6f1939eea8.svg",
  close: "09914081-145a-482c-a94f-1019642e2bc3.svg",
  holiday: "e22504f4-df35-4107-9e01-5ac0c84aee64.svg",
  moon: "35461c58-b2ea-46f8-940b-201b6aa8e1f1.svg",
  people: "7a078870-1969-4ab2-adbd-8107c25f9c4e.svg",
  event: "492e477f-7702-4065-ac34-585b6c460454.svg",
  photo: "d98296f8-1f07-442f-a577-ca93d33bbf45.svg",
  heart: "81db5627-9b7a-46f7-a1c2-28bbb48f24f9.svg",
  drinks: "0f9e270a-4ff4-40d4-bd25-c4148be67f62.svg",
  poll: "69d3229c-7380-4c95-950c-4d4d603f5f7f.svg",
  profileInfo: "46166371-541f-41e6-b9eb-d2806d455e69.svg",
  profileSettings: "64440be3-91d1-4ff2-ac55-0e2c6ef0270a.svg",
  profilePhotos: "6de23b7c-892e-4dd3-aa88-ffd3c33cacdc.svg",
  profileConnections: "600507bb-4e1d-4c45-976a-c8711ed17fbe.svg",
};

const photos = {
  indoor: "c211a5d4-fd7b-40a7-9e5a-2f708f42e499.png",
  outdoor: "18adcf4d-e6c6-420e-9f0d-5c7e52832354.png",
  portrait: "242e2d3c-ab89-45c3-a9d3-893a9e002a95.png",
  largeOutdoor: "3e7061f0-6f42-4f13-924a-d4282e9329e3.png",
  calendarEvent: "17bcbbe2-dfdd-4f5e-8311-fe63bcde00e3.png",
  calendarPortrait: "fcd3b457-57a0-47d4-aeeb-576cedfdc218.png",
  avatar: "40e3e77f-fed1-4a3e-b92b-ff390a507306.png",
  meetingAvatar: "76439c70-77c3-4ec6-87d4-c727336b5039.png",
};

const pageInfo = {
  home: { title: "Heim", icon: icons.home, active: "home" },
  news: { title: "Hvað er að frétta?", icon: icons.news, active: "news" },
  meetings: { title: "Hittingarspjall", icon: icons.meetings, active: "meetings" },
  "calendar-day": { title: "Viðburðir & dagatal", icon: icons.calendar, active: "calendar" },
  "calendar-week": { title: "Viðburðir & dagatal", icon: icons.calendar, active: "calendar" },
  "calendar-month": { title: "Viðburðir & dagatal", icon: icons.calendar, active: "calendar" },
  messages: { title: "Skilaboð", icon: icons.messages, active: "messages" },
  profile: { title: "Prófíll", icon: icons.profile, active: "profile" },
};

const avatar = (image = photos.portrait, alt = "Prófílmynd") =>
  `<img src="${asset(image)}" alt="${alt}">`;

const icon = (image, className = "heading-icon") =>
  `<img class="${className}" src="${asset(image)}" alt="">`;

function renderAvatars(count = "+16", source = photos.portrait) {
  return `<div class="avatar-stack" aria-label="Fólk skráð á viðburð">
    ${avatar(source, "")}${avatar(source, "")}${avatar(source, "")}
    <span>${count}</span>
  </div>`;
}

function renderHome() {
  return `
    <section class="welcome-banner">
      <h1>Velkomin í New Friends!</h1>
      <p>Hér tengjast konur, kynnast, skipuleggja hittingar, njótum saman skemmtilegra viðburða.</p>
    </section>
    <div class="home-grid">
      <div class="home-left">
        <section class="panel upcoming-card">
          <h2 class="panel-heading">${icon(icons.calendar)}Næsti hittingur</h2>
          <div class="upcoming-body">
            <img class="event-photo" src="${asset(photos.indoor)}" alt="Vinir hittast yfir kaffibolla">
            <div class="event-info">
              <h3>Jólaföndur, snarl og spjall ${icon(icons.holiday, "event-title-icon")}</h3>
              <p class="event-meta">
                <span class="meta-item">${icon(icons.calendar, "")}Lau. 15. des. 2026</span>
                <span class="meta-item">${icon(icons.clock, "")}Klukkan 18:00 - 22:00</span>
                <span class="meta-item">${icon(icons.pin, "")}Bræðraborgarstíg 2, Reykjavík</span>
              </p>
              <div class="event-footer">
                ${renderAvatars("+16")}
                <button class="button button-primary attendance-button" type="button" data-action="attend" aria-pressed="false">
                  ${icon(icons.check, "")}<span>Mæta</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        <section class="panel feed-preview">
          <h2 class="panel-heading">${icon(icons.news)}Hvað er að frétta?</h2>
          <div class="feed-preview-body">
            <div>
              <div class="post-author">${avatar(photos.portrait, "Anna")}<span>Anna<small>2 klst. síðan</small></span></div>
              <p>Hlakka til að hitta ykkur næstu helgi!<br>Megið endilega koma með ykkar veitingar!</p>
            </div>
            <img class="post-photo" src="${asset(photos.outdoor)}" alt="Vinahópur spjallar utandyra">
          </div>
        </section>
      </div>
      <section class="notifications-panel" id="notifications">
        <div class="notifications-head">
          <h2 class="panel-heading">${icon(icons.notifications)}Tilkynningar</h2>
          <button type="button" data-action="mark-read">Skoða allar ${icon(icons.arrow, "")}</button>
        </div>
        ${renderNotification("Hvað er að frétta?", "Ný viðburður, skráðu þig ef þú vilt taka þátt í jólaföndrun.", "1 klst. síðan", photos.avatar)}
        ${renderNotification("Dagatal", "Ný viðburður, skráðu þig ef þú vilt taka þátt í jólaföndrun.", "2 klst. síðan", photos.avatar)}
        ${renderNotification("Skilaboð", "Ný viðburður, skráðu þig ef þú vilt taka þátt í jólaföndrun.", "5 klst. síðan", photos.avatar)}
        ${renderNotification("Skilaboð", "Ný viðburður, skráðu þig ef þú vilt taka þátt í jólaföndrun.", "8 klst. síðan", photos.avatar)}
      </section>
    </div>`;
}

function renderNotification(title, description, time, image) {
  return `<article class="notification-item" data-searchable>
    <img src="${asset(image)}" alt="">
    <div><small>${title}　${time}</small><span>${description}</span></div>
  </article>`;
}

function renderNews() {
  return `
    <div class="page-stack">
      <section class="content-card composer">
        <div class="composer-top">${avatar(photos.portrait, "Luna")}<strong>Búa til færslu</strong></div>
        <form class="composer-form" data-form="post">
          <input name="post" placeholder="Hvað viltu deila?" aria-label="Hvað viltu deila?" required>
          <button class="button button-primary" type="submit">Búa til færslu</button>
        </form>
      </section>
      ${renderPost("Jólaföndur", "Stína", "Hlakka svo til að hitta ykkur á jólaföndrun! 🎄✨<br>Er einhver búin að ákveða hvað hún ætlar að föndra?", photos.largeOutdoor)}
      ${renderPost("Jólaganga", "Jónína", "Mig langar að fara í göngutúr um helgina! 🌿<br>Er einhver til í að koma með? Við gætum endað á notalegu kaffihúsi ☕", photos.largeOutdoor)}
    </div>`;
}

function renderPost(title, author, message, image) {
  return `<article class="content-card post-card" data-searchable>
    <div>
      <h2 class="panel-heading">${icon(icons.news)}${title}</h2>
      <div class="post-author">${avatar(photos.portrait, author)}<span>${author}<small>2 klst. síðan</small></span></div>
      <p>${message}</p>
    </div>
    <img class="post-photo" src="${asset(image)}" alt="Vinahópur saman úti">
  </article>`;
}

function renderMeetings() {
  const groups = [
    { title: "Hvaða dagur hentar þér?", icon: icons.calendar, options: ["Föstudagur 11. des", "Laugardagur 13. des", "Laugardagur 16. des", "Mánudagur 23. des"] },
    { title: "Hvaða tími hentar þér?", icon: icons.clock, options: ["Kl. 10:00 - 12:00", "13:00 - 15:00", "16:00 - 18:00", "19:00-21:00"] },
    { title: "Hvar viltu að það sé haldið?", icon: icons.pin, options: ["Heima hjá einhverjum", "Á veitingastað", "Hjá mér", "Pantaðan sal"] },
    { title: "Hvað viltu drekka?", icon: icons.drinks, options: ["Pepsi max", "Kristall", "7up", "Annað"] },
  ];

  return `
    <div class="page-stack">
      <section class="content-card meeting-compose">
        <div class="composer-top">${avatar(photos.portrait, "Luna")}<strong>Búa til hitting</strong></div>
        <form class="composer-form" data-form="meeting">
          <input name="meeting" placeholder="Skrifaðu hér..." aria-label="Skrifaðu um hitting" required>
          <div class="composer-actions">
            <button class="button" type="button">${icon(icons.poll, "")}Könnun</button>
            <button class="button" type="button">${icon(icons.photo, "")}Mynd/Myndband</button>
            <button class="button" type="button">${icon(icons.calendar, "")}Hittingur</button>
            <button class="button" type="button">${icon(icons.pin, "")}Staðsetning</button>
            <button class="button button-primary" type="submit">${icon(icons.heart, "")}Birta</button>
          </div>
        </form>
      </section>
      <article class="content-card meeting-poll" data-searchable>
        <div class="post-author">${avatar(photos.meetingAvatar, "Luna")}<span>Luna<small>2 klst. síðan</small></span></div>
        <h2>Skipuleggjum jólaföndur 🎄</h2>
        <p>Hjálpumst að við að velja dagsetningu, tíma og veitingar fyrir næsta hitting! Veldu það sem hentar þér best. 💗</p>
        <form class="poll-columns" data-form="poll">
          ${groups.map((group, index) => `<section class="poll-column">
            <h3>${group.title}</h3>
            ${group.options.map((option, optionIndex) => `<label class="poll-option">
              <span>${icon(group.icon, "")}${option}</span>
              <input type="checkbox" name="poll-${index}" value="${optionIndex}" aria-label="${option}">
            </label>`).join("")}
          </section>`).join("")}
        </form>
        <div class="poll-footer"><button class="button" type="button" data-action="comment">${icon(icons.messages, "")}Athugasemd</button></div>
      </article>
    </div>`;
}

function renderCalendar(mode) {
  const selectedMode = mode.replace("calendar-", "");
  const days = Array.from({ length: selectedMode === "week" ? 7 : 35 }, (_, index) =>
    `<button type="button" aria-label="Velja dag ${index + 1}" data-action="select-day"></button>`);
  const weekDays = ["Mán", "Þrið", "Mið", "Fimmt", "Föst", "Laug", "Sunn"];
  const eventImage = photos.calendarEvent;
  return `
    <div class="calendar-toolbar">
      <nav class="calendar-tabs" aria-label="Dagatalssýn">
        <a class="button ${selectedMode === "month" ? "is-selected" : ""}" href="app.html?view=calendar-month">Mánaðarsýn</a>
        <a class="button ${selectedMode === "week" ? "is-selected" : ""}" href="app.html?view=calendar-week">Vikusýn</a>
        <a class="button ${selectedMode === "day" ? "is-selected" : ""}" href="app.html?view=calendar-day">Dagsýn</a>
      </nav>
      <button class="button button-primary" type="button" data-action="create-calendar">${icon(icons.plus, "")}Bæta við dagatalið mitt</button>
    </div>
    <div class="calendar-layout">
      <section class="calendar-card ${selectedMode === "week" ? "week-view" : ""}">
        <div class="month-heading">
          <button type="button" aria-label="Fyrra tímabil">‹</button>
          <span>${selectedMode === "week" ? "Nóvember　 1 - 7.　 2026" : selectedMode === "day" ? "Dagur　2026" : "Nóvember　2026"}</span>
          <button type="button" aria-label="Næsta tímabil">›</button>
        </div>
        <div class="weekdays">${weekDays.map((day) => `<span>${day}</span>`).join("")}</div>
        <div class="calendar-days">${days.join("")}</div>
      </section>
      <article class="event-card" data-searchable>
        <img src="${asset(eventImage)}" alt="Vinahópur hittist í garði">
        <h2>Jólaföndur, snarl og spjall</h2>
        <p class="event-meta">
          <span class="meta-item">${icon(icons.calendar, "")}Lau. 15. des. 2026</span>
          <span class="meta-item">${icon(icons.clock, "")}Klukkan 18:00 - 22:00</span>
          <span class="meta-item">${icon(icons.pin, "")}Bræðraborgarstíg 2, Reykjavík</span>
        </p>
        <div class="event-footer">
          ${renderAvatars("+18", photos.calendarPortrait)}
          <small>21 ætla að mæta</small>
        </div>
        <div class="event-footer">
          <button class="button attendance-button" type="button" data-action="attend" aria-pressed="false">${icon(icons.check, "")}<span>Mæta</span></button>
          <button class="button button-primary attendance-button" type="button" data-action="decline" aria-pressed="false">${icon(icons.close, "")}<span>Mæti ekki</span></button>
        </div>
      </article>
      <section class="upcoming-list">
        <h2>${icon(icons.calendar)}Næstu viðburðir</h2>
        ${renderUpcoming("Jólaföndur, snarl og spjall með stelpunum.", "Lau. 2. des 14:00 - 17:00", eventImage)}
        ${renderUpcoming("Ganga í Heiðmörk.", "Lau. 10. des 14:00 - 17:00")}
        ${renderUpcoming("Prjóna og saumakvöld.", "Lau. 16. des 14:00 - 17:00")}
        ${renderUpcoming("Bíókvöld að horfa á jólamynd.", "Lau. 27. des 14:00 - 17:00")}
      </section>
    </div>`;
}

function renderUpcoming(title, date, image = "") {
  return `<article class="upcoming-list-item" data-searchable>
    ${image ? `<img src="${asset(image)}" alt="">` : `<span class="event-placeholder"></span>`}
    <div><p>${title}</p><small>${icon(icons.calendar, "")}${date}　›</small></div>
  </article>`;
}

function renderMessages() {
  return `
    <div class="messages-layout">
      <section class="people-panel">
        <h2>Skilaboð</h2>
        <input class="message-search" type="search" placeholder="⌕　Leita að samtali..." aria-label="Leita að samtali">
        <p class="message-filter">⌄</p>
      </section>
      <section class="chat-panel">
        <div class="empty-chat">
          ${icon(icons.messages, "")}
          <h2>Skoðaboðin þín</h2>
          <p>Byrjaðu að spjalla</p>
          <button class="button button-primary" type="button" data-action="new-message">${icon(icons.plus, "")}Ný skilaboð</button>
        </div>
      </section>
    </div>`;
}

function renderProfile() {
  return `
    <div class="profile-layout">
      <section class="profile-panel">
        <h2>Prófíllinn minn</h2>
        <nav aria-label="Prófílvalmynd">
          <a href="#profile">${icon(icons.profileInfo, "")}Prófílupplýsingar</a>
          <a href="#settings">${icon(icons.profileSettings, "")}Stillingar</a>
          <a href="#photos">${icon(icons.profilePhotos, "")}Myndir</a>
          <a href="#friends">${icon(icons.profileConnections, "")}Tengslabönd</a>
        </nav>
      </section>
      <section class="profile-panel profile-welcome">
        <img src="${asset("5b0192a6-a345-4e38-857a-3b1c99641ecc.png")}" alt="Luna A. Jónasdóttir">
        <h1>Luna A. Jónasdóttir</h1>
        <p>Byrjaðu að fylla prófílinn!</p>
        <button class="button button-primary" type="button" data-action="start-profile">${icon(icons.plus, "")}Byrjaðu</button>
      </section>
    </div>`;
}

const view = new URLSearchParams(window.location.search).get("view") || "home";
const current = pageInfo[view] ? view : "home";
const renderers = {
  home: renderHome,
  news: renderNews,
  meetings: renderMeetings,
  "calendar-day": () => renderCalendar("calendar-day"),
  "calendar-week": () => renderCalendar("calendar-week"),
  "calendar-month": () => renderCalendar("calendar-month"),
  messages: renderMessages,
  profile: renderProfile,
};

document.title = `${pageInfo[current].title} - New Friends`;
document.getElementById("page-heading").innerHTML =
  `${icon(pageInfo[current].icon, "")}<span>${pageInfo[current].title}</span>`;
document.getElementById("screen").innerHTML = renderers[current]();
document.querySelectorAll(".side-nav [data-view]").forEach((link) => {
  if (link.dataset.view === pageInfo[current].active) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

const themeToggle = document.getElementById("theme-toggle");
themeToggle.checked = localStorage.getItem("darkMode") === "on";
document.body.classList.toggle("dark-mode", themeToggle.checked);
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", themeToggle.checked);
  localStorage.setItem("darkMode", themeToggle.checked ? "on" : "off");
});

const screen = document.getElementById("screen");
screen.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "attend" || button.dataset.action === "decline") {
    const selected = !button.classList.contains("is-selected");
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
    const label = button.querySelector("span");
    if (label) {
      label.textContent = selected
        ? (button.dataset.action === "attend" ? "Skráð mæting" : "Skráð forföll")
        : (button.dataset.action === "attend" ? "Mæta" : "Mæti ekki");
    }
    return;
  }

  if (button.dataset.action === "new-message") {
    const emptyChat = screen.querySelector(".empty-chat");
    emptyChat.innerHTML = `<form class="message-compose" data-form="message">
      <h2>Ný skilaboð</h2>
      <input name="recipient" placeholder="Leita að samtali..." aria-label="Leita að viðtakanda" required>
      <textarea name="message" placeholder="Skrifaðu skilaboð..." aria-label="Skrifaðu skilaboð" required></textarea>
      <button class="button button-primary" type="submit">Senda skilaboð</button>
    </form>`;
  }

  if (button.dataset.action === "start-profile") {
    const panel = screen.querySelector(".profile-welcome");
    panel.innerHTML = `<form class="profile-form" data-form="profile">
      <h2>Uppfærðu prófílinn þinn</h2>
      <label>Nafn<input name="name" value="Luna A. Jónasdóttir" required></label>
      <label>Um mig<textarea name="about" placeholder="Segðu okkur aðeins frá þér"></textarea></label>
      <button class="button button-primary" type="submit">Vista prófíl</button>
    </form>`;
  }

  if (button.dataset.action === "comment") {
    const footer = button.parentElement;
    footer.innerHTML = `<form class="composer-form comment-form" data-form="comment">
      <input name="comment" placeholder="Skrifaðu athugasemd..." aria-label="Skrifaðu athugasemd" required>
      <button class="button button-primary" type="submit">Senda</button>
    </form>`;
  }

  if (button.dataset.action === "mark-read") {
    screen.querySelectorAll(".notification-item").forEach((item) => item.classList.add("read"));
    showToast("Allar tilkynningar skoðaðar");
  }

  if (button.dataset.action === "create-calendar") showToast("Dagatalið þitt er tilbúið");
});

screen.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-form]");
  if (!form) return;
  event.preventDefault();

  if (form.dataset.form === "post") {
    const text = form.elements.post.value.trim();
    if (!text) return;
    const post = document.createElement("article");
    post.className = "content-card post-card";
    post.dataset.searchable = "";
    post.innerHTML = `<div><h2 class="panel-heading">${icon(icons.news)}Ný færsla</h2>
      <div class="post-author">${avatar(photos.portrait, "Luna")}<span>Luna<small>Núna</small></span></div>
      <p></p></div><img class="post-photo" src="${asset(photos.largeOutdoor)}" alt="Vinahópur saman úti">`;
    post.querySelector("p").textContent = text;
    form.closest(".page-stack").insertBefore(post, form.closest(".content-card").nextSibling);
    form.reset();
    showToast("Færslan hefur verið birt");
    return;
  }

  if (form.dataset.form === "meeting") {
    showToast("Hittingurinn hefur verið birtur");
    form.reset();
    return;
  }

  if (form.dataset.form === "message") {
    showToast("Skilaboðin eru tilbúin");
    form.reset();
    return;
  }

  if (form.dataset.form === "profile") {
    showToast("Prófíllinn hefur verið vistaður");
  }

  if (form.dataset.form === "comment") {
    showToast("Athugasemdin hefur verið send");
    form.reset();
  }
});

document.getElementById("global-search").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLocaleLowerCase("is");
  screen.querySelectorAll("[data-searchable]").forEach((item) => {
    item.classList.toggle("search-empty", Boolean(query) && !item.textContent.toLocaleLowerCase("is").includes(query));
  });
});

document.querySelector('[data-action="notifications"]').addEventListener("click", () => {
  window.location.href = "app.html?view=home#notifications";
});

function showToast(message) {
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 2600);
}
