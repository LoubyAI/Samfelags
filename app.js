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

let meetingDraft = { text: "", attachments: [], poll: null, event: null, location: "" };
let meetingPosts = [];
let editingMeetingId = null;

const pageInfo = {
  home: { title: "Heim", icon: icons.home, active: "home" },
  news: { title: "Hvað er að frétta?", icon: icons.news, active: "news" },
  meetings: { title: "Hittingarspjall", icon: icons.meetings, active: "meetings" },
  "calendar-day": { title: "Viðburðir & dagatal", icon: icons.calendar, active: "calendar" },
  "calendar-week": { title: "Viðburðir & dagatal", icon: icons.calendar, active: "calendar" },
  "calendar-month": { title: "Viðburðir & dagatal", icon: icons.calendar, active: "calendar" },
  messages: { title: "Skilaboð", icon: icons.messages, active: "messages" },
  profile: { title: "Prófíll", icon: icons.profile, active: "profile" },
  login: { title: "Skrá inn", icon: icons.profile, active: "" },
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
          <button type="button" data-action="mark-read">Merkja allar sem lesnar</button>
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

function renderNotificationsDropdown() {
  const notifications = [
    ["Hvað er að frétta?", "Ný færsla í vinahópnum þínum.", "1 klst. síðan"],
    ["Dagatal", "Nýr viðburður: Jólaföndur, snarl og spjall.", "2 klst. síðan"],
    ["Skilaboð", "Anna sendi þér skilaboð.", "5 klst. síðan"],
    ["Hittingarspjall", "Ný könnun bíður eftir svarinu þínu.", "8 klst. síðan"],
  ];

  return `<div class="notifications-head">
      <h2 class="panel-heading">${icon(icons.notifications)}Tilkynningar</h2>
      <button type="button" data-action="mark-read">Merkja allar sem lesnar</button>
    </div>
    <div class="notifications-list">
      ${notifications.map(([title, description, time]) =>
        renderNotification(title, description, time, photos.avatar)).join("")}
    </div>
    <a class="notifications-all" href="app.html?view=home#notifications">Skoða allar tilkynningar</a>`;
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
          <textarea name="post" placeholder="Skrifaðu hér..." aria-label="Skrifaðu um hitting"></textarea>
          <div class="meeting-draft-preview" id="meeting-draft-preview"></div>
          <div class="composer-actions">
            <button class="button" type="button" data-action="meeting-poll">${icon(icons.poll, "")}Könnun</button>
            <button class="button" type="button" data-action="meeting-media">${icon(icons.photo, "")}Mynd/Myndband</button>
            <button class="button" type="button" data-action="meeting-event">${icon(icons.calendar, "")}Hittingur</button>
            <button class="button" type="button" data-action="meeting-location">${icon(icons.pin, "")}Staðsetning</button>
            <button class="button button-primary" type="submit">${icon(icons.heart, "")}${editingMeetingId ? "Vista breytingar" : "Birta"}</button>
          </div>
          <input class="meeting-file-input" id="meeting-media-input" type="file" accept="image/*,video/*" multiple aria-label="Velja myndir eða myndbönd" hidden>
        </form>
        <section class="meeting-editor" id="meeting-editor" hidden></section>
      </section>
      <div class="meeting-post-list" id="meeting-post-list">${meetingPosts.map(renderMeetingPost).join("")}</div>
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

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function renderMeetingDraftPreview() {
  const parts = [];

  if (meetingDraft.attachments.length) {
    parts.push(`<div class="meeting-attachments">
      ${meetingDraft.attachments.map((attachment, index) => {
        const preview = attachment.type.startsWith("video/")
          ? `<video src="${escapeHtml(attachment.url)}" controls preload="metadata" aria-label="${escapeHtml(attachment.name)}"></video>`
          : `<img src="${escapeHtml(attachment.url)}" alt="${escapeHtml(attachment.name)}">`;
        return `<div class="meeting-attachment">
          ${preview}
          <button class="attachment-remove" type="button" data-action="remove-meeting-attachment" data-attachment-index="${index}" aria-label="Fjarlægja ${escapeHtml(attachment.name)}">×</button>
        </div>`;
      }).join("")}
    </div>`);
  }

  if (meetingDraft.poll) {
    parts.push(`<section class="meeting-draft-card">
      <strong>${escapeHtml(meetingDraft.poll.question)}</strong>
      <ul>${meetingDraft.poll.options.map((option) => `<li>${escapeHtml(option)}</li>`).join("")}</ul>
    </section>`);
  }

  if (meetingDraft.event) {
    const details = [
      meetingDraft.event.date ? formatMeetingDate(meetingDraft.event.date) : "",
      meetingDraft.event.time,
      meetingDraft.event.location,
    ].filter(Boolean).map(escapeHtml).join(" · ");
    parts.push(`<section class="meeting-draft-card">
      <strong>${escapeHtml(meetingDraft.event.title)}</strong>
      ${details ? `<span>${details}</span>` : ""}
      ${meetingDraft.event.description ? `<p>${escapeHtml(meetingDraft.event.description)}</p>` : ""}
    </section>`);
  }

  if (meetingDraft.location) {
    parts.push(`<section class="meeting-draft-card meeting-location-draft">${icon(icons.pin, "")}${escapeHtml(meetingDraft.location)}</section>`);
  }

  return parts.join("");
}

function renderPollOptionInput(value, index) {
  return `<label class="meeting-editor-field">
    <span>Valkostur ${index}</span>
    <input name="option" value="${escapeHtml(value)}" placeholder="Skrifaðu valkost">
  </label>`;
}

function renderMeetingEditor(type) {
  if (type === "poll") {
    const poll = meetingDraft.poll || { question: "", options: ["", ""] };
    return `<div class="meeting-editor-head">
        <h3>Búa til könnun</h3>
        <button class="editor-close" type="button" data-action="close-meeting-editor" aria-label="Loka">×</button>
      </div>
      <form data-form="meeting-poll">
        <label class="meeting-editor-field">Spurning<input name="question" value="${escapeHtml(poll.question)}" placeholder="Hvað viltu spyrja?"></label>
        <div class="meeting-poll-options" id="meeting-poll-options">
          ${poll.options.map((option, index) => renderPollOptionInput(option, index + 1)).join("")}
        </div>
        <button class="button add-poll-option" type="button" data-action="add-poll-option">${icon(icons.plus, "")}Bæta við valkosti</button>
        <div class="meeting-editor-actions">
          <button class="button" type="button" data-action="close-meeting-editor">Hætta við</button>
          <button class="button button-primary" type="submit">Vista könnun</button>
        </div>
      </form>`;
  }

  if (type === "event") {
    const meetingEvent = meetingDraft.event || { title: "", date: "", time: "", location: "", description: "" };
    return `<div class="meeting-editor-head">
        <h3>Búa til hitting</h3>
        <button class="editor-close" type="button" data-action="close-meeting-editor" aria-label="Loka">×</button>
      </div>
      <form data-form="meeting-event">
        <label class="meeting-editor-field">Heiti<input name="title" value="${escapeHtml(meetingEvent.title)}" placeholder="Heiti hittings"></label>
        <div class="meeting-event-fields">
          <label class="meeting-editor-field">Dagsetning<input name="date" type="date" value="${escapeHtml(meetingEvent.date)}"></label>
          <label class="meeting-editor-field">Tími<input name="time" type="time" value="${escapeHtml(meetingEvent.time)}"></label>
        </div>
        <label class="meeting-editor-field">Staðsetning<input name="location" value="${escapeHtml(meetingEvent.location)}" placeholder="Hvar hittumst við?"></label>
        <label class="meeting-editor-field">Lýsing<textarea name="description" placeholder="Nánari upplýsingar">${escapeHtml(meetingEvent.description)}</textarea></label>
        <div class="meeting-editor-actions">
          <button class="button" type="button" data-action="close-meeting-editor">Hætta við</button>
          <button class="button button-primary" type="submit">Vista hitting</button>
        </div>
      </form>`;
  }

  return `<div class="meeting-editor-head">
      <h3>Bæta við staðsetningu</h3>
      <button class="editor-close" type="button" data-action="close-meeting-editor" aria-label="Loka">×</button>
    </div>
    <form data-form="meeting-location">
      <label class="meeting-editor-field">Staðsetning<input name="location" value="${escapeHtml(meetingDraft.location)}" placeholder="Sláðu inn staðsetningu"></label>
      <div class="meeting-editor-actions">
        <button class="button" type="button" data-action="close-meeting-editor">Hætta við</button>
        <button class="button button-primary" type="submit">Vista staðsetningu</button>
      </div>
    </form>`;
}

function formatMeetingDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("is-IS", { dateStyle: "long" }).format(new Date(year, month - 1, day));
}

function renderMeetingPost(post) {
  const postId = escapeHtml(post.id);
  const media = post.attachments.map((attachment) => {
    const source = escapeHtml(attachment.url);
    return attachment.type.startsWith("video/")
      ? `<video src="${source}" controls preload="metadata" aria-label="${escapeHtml(attachment.name)}"></video>`
      : `<img src="${source}" alt="${escapeHtml(attachment.name)}">`;
  }).join("");
  const poll = post.poll ? (() => {
    const votes = post.poll.votes || [];
    const total = votes.reduce((sum, count) => sum + count, 0);
    const options = post.poll.options.map((option, index) => {
      const count = Number(votes[index]) || 0;
      const percentage = total ? Math.round((count / total) * 100) : 0;
      return post.poll.voted
        ? `<div class="meeting-vote-result">
            <div><span>${escapeHtml(option)}</span><strong>${count}</strong></div>
            <div class="meeting-vote-track"><span style="width: ${percentage}%"></span></div>
          </div>`
        : `<label class="meeting-vote-option"><input type="radio" name="vote" value="${index}">${escapeHtml(option)}</label>`;
    }).join("");
    const voteForm = post.poll.voted
      ? `<p class="meeting-vote-count">${total} atkvæði</p>`
      : `<form data-form="meeting-vote" data-post-id="${postId}">
          <div class="meeting-vote-options">${options}</div>
          <button class="button button-primary" type="submit">Kjósa</button>
        </form>`;
    return `<section class="meeting-post-section">
      <h3>${escapeHtml(post.poll.question)}</h3>
      ${voteForm}
    </section>`;
  })() : "";
  const event = post.event ? `<section class="meeting-post-section">
      <h3>${escapeHtml(post.event.title)}</h3>
      <p>${[
        post.event.date ? formatMeetingDate(post.event.date) : "",
        post.event.time,
        post.event.location,
      ].filter(Boolean).map(escapeHtml).join(" · ")}</p>
      ${post.event.description ? `<p>${escapeHtml(post.event.description)}</p>` : ""}
    </section>` : "";
  const location = post.location ? `<p class="meeting-post-location">${icon(icons.pin, "")}${escapeHtml(post.location)}</p>` : "";

  return `<article class="content-card meeting-created-post" data-searchable>
    <div class="meeting-created-head">
      <div class="post-author">${avatar(photos.portrait, "Luna")}<span>Luna<small>Núna</small></span></div>
      <button class="button" type="button" data-action="edit-meeting-post" data-post-id="${postId}">Breyta</button>
    </div>
    ${post.text ? `<p class="meeting-post-text">${escapeHtml(post.text)}</p>` : ""}
    ${media ? `<div class="meeting-post-media">${media}</div>` : ""}
    ${poll}
    ${event}
    ${location}
  </article>`;
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
        <button class="button button-primary" type="button">${icon(icons.plus, "")}Byrjaðu</button>
      </section>
    </div>`;
}

function renderLogin() {
  return `
    <section class="login-page" aria-label="Innskráning">
      <header class="login-header">
        <div class="login-brand">
          <span class="login-brand-name">New Friends</span>
          <img src="${asset(icons.people)}" alt="">
          <span class="login-brand-tagline">Connect · Meet · Build Friendships</span>
        </div>
      </header>
      <div class="login-layout">
        <section class="login-welcome">
          <div class="login-intro">
            <h1>Ný vinátta byrjar hér</h1>
            <p>Kynnstu konum, skipuleggðu hittinga og taktu þátt í skemmtilegum viðburðum.</p>
          </div>
          <img class="login-photo" src="${asset(photos.largeOutdoor)}" alt="Vinahópur nýtur samveru">
        </section>
        <section class="login-panel">
          <div class="login-form-card">
            <h2>Velkomin aftur!</h2>
            <p class="login-subtitle">Skráðu þig inn til að halda áfram.</p>
            <form class="login-form" data-form="login">
              <label for="login-email">Netfang</label>
              <input id="login-email" name="email" type="email" autocomplete="email" placeholder="Sláðu inn netfangið þitt" required>
              <label for="login-password">Lykilorð</label>
              <input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Sláðu inn lykilorðið þitt" required>
              <button class="login-forgot" type="button" data-action="forgot-password">Gleymt lykilorði?</button>
              <button class="button button-primary login-submit" type="submit">Skrá inn</button>
            </form>
            <div class="login-divider"><span>eða</span></div>
            <button class="login-google" type="button" data-action="google-login">
              <svg class="login-google-icon" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.47-4.79 7.16l7.73 6c4.51-4.17 7.1-10.32 7.1-17.63z"/>
                <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.77-4.59l-7.98-6.19A23.93 23.93 0 0 0 0 24c0 3.86.92 7.5 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.82l-7.73-6c-2.14 1.43-4.88 2.27-8.18 2.27-6.26 0-11.57-4.22-13.47-9.9l-7.97 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>Halda áfram með Google</span>
            </button>
            <p class="login-signup">Ný í New Friends? <button type="button" data-action="create-account">Búðu til aðgang</button></p>
          </div>
        </section>
      </div>
      <footer class="login-footer">
        <p>© 2026 New Friends</p>
      </footer>
    </section>`;
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
  login: renderLogin,
};

document.body.classList.toggle("login-view", current === "login");
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
themeToggle.checked = current !== "login" && localStorage.getItem("darkMode") === "on";
document.body.classList.toggle("dark-mode", themeToggle.checked);
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", themeToggle.checked);
  localStorage.setItem("darkMode", themeToggle.checked ? "on" : "off");
});

const screen = document.getElementById("screen");
const notificationButton = document.querySelector(".notification-button");
const notificationDropdown = document.getElementById("notifications-dropdown");
notificationDropdown.innerHTML = renderNotificationsDropdown();
updateNotificationCount();

screen.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "meeting-poll") {
    openMeetingEditor("poll");
    return;
  }

  if (button.dataset.action === "meeting-event") {
    openMeetingEditor("event");
    return;
  }

  if (button.dataset.action === "meeting-location") {
    openMeetingEditor("location");
    return;
  }

  if (button.dataset.action === "meeting-media") {
    screen.querySelector("#meeting-media-input").click();
    return;
  }

  if (button.dataset.action === "add-poll-option") {
    const options = screen.querySelector("#meeting-poll-options");
    options.insertAdjacentHTML("beforeend", renderPollOptionInput("", options.children.length + 1));
    options.lastElementChild.querySelector("input").focus();
    return;
  }

  if (button.dataset.action === "close-meeting-editor") {
    closeMeetingEditor();
    return;
  }

  if (button.dataset.action === "remove-meeting-attachment") {
    const index = Number(button.dataset.attachmentIndex);
    meetingDraft.attachments.splice(index, 1);
    updateMeetingComposer();
    return;
  }

  if (button.dataset.action === "edit-meeting-post") {
    const post = meetingPosts.find((item) => item.id === button.dataset.postId);
    if (!post) {
      showToast("Ekki tókst að finna færsluna");
      return;
    }

    editingMeetingId = post.id;
    meetingDraft = {
      text: post.text,
      attachments: [...post.attachments],
      poll: post.poll ? {
        ...post.poll,
        options: [...post.poll.options],
        votes: [...(post.poll.votes || [])],
      } : null,
      event: post.event ? { ...post.event } : null,
      location: post.location,
    };
    screen.querySelector('[data-form="meeting"] textarea[name="post"]').value = post.text;
    closeMeetingEditor();
    updateMeetingComposer();
    screen.querySelector(".meeting-compose").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (button.dataset.action === "forgot-password") {
    showToast("Endurstilling lykilorðs er ekki tengd ennþá");
    return;
  }

  if (button.dataset.action === "google-login") {
    showToast("Innskráning með Google er ekki tengd ennþá");
    return;
  }

  if (button.dataset.action === "create-account") {
    showToast("Nýskráning er ekki tengd ennþá");
    return;
  }

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

  if (button.dataset.action === "comment") {
    const footer = button.parentElement;
    footer.innerHTML = `<form class="composer-form comment-form" data-form="comment">
      <input name="comment" placeholder="Skrifaðu athugasemd..." aria-label="Skrifaðu athugasemd" required>
      <button class="button button-primary" type="submit">Senda</button>
    </form>`;
  }

  if (button.dataset.action === "mark-read") {
    markAllNotificationsRead();
  }

  if (button.dataset.action === "create-calendar") showToast("Dagatalið þitt er tilbúið");
});

screen.addEventListener("change", (event) => {
  if (event.target.id !== "meeting-media-input") return;

  const files = Array.from(event.target.files || []);
  const supportedFiles = files.filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"));
  if (supportedFiles.length !== files.length) {
    showToast("Aðeins er hægt að bæta við myndum eða myndböndum");
  }
  supportedFiles.forEach((file) => {
    meetingDraft.attachments.push({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    });
  });
  event.target.value = "";
  updateMeetingComposer();
});

notificationButton.addEventListener("click", () => {
  setNotificationsOpen(notificationDropdown.hidden);
});

notificationDropdown.addEventListener("click", (event) => {
  if (event.target.closest('[data-action="mark-read"]')) {
    markAllNotificationsRead();
  }
});

document.addEventListener("click", (event) => {
  if (!notificationDropdown.hidden && !event.target.closest(".notification-control")) {
    setNotificationsOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !notificationDropdown.hidden) {
    setNotificationsOpen(false);
    notificationButton.focus();
  }
});

screen.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-form]");
  if (!form) return;
  event.preventDefault();

  if (form.dataset.form === "login") {
    showToast("Innskráning er ekki tengd aðgangakerfi");
    return;
  }

  if (form.dataset.form === "meeting-poll") {
    const question = form.elements.question.value.trim();
    const options = Array.from(form.querySelectorAll('input[name="option"]'))
      .map((input) => input.value.trim())
      .filter(Boolean);
    if (!question || options.length < 2) {
      showToast("Skrifaðu spurningu og að minnsta kosti tvo valkosti");
      return;
    }

    const previousPoll = meetingDraft.poll;
    const sameOptions = previousPoll
      && previousPoll.options.length === options.length
      && previousPoll.options.every((option, index) => option === options[index]);
    meetingDraft.poll = {
      question,
      options,
      votes: sameOptions ? [...(previousPoll.votes || [])] : Array(options.length).fill(0),
      voted: Boolean(sameOptions && previousPoll.voted),
    };
    closeMeetingEditor();
    updateMeetingComposer();
    showToast("Könnun bætt við færsluna");
    return;
  }

  if (form.dataset.form === "meeting-event") {
    const title = form.elements.title.value.trim();
    const date = form.elements.date.value;
    if (!title || !date) {
      showToast("Skrifaðu heiti og veldu dagsetningu hittingsins");
      return;
    }

    meetingDraft.event = {
      title,
      date,
      time: form.elements.time.value,
      location: form.elements.location.value.trim(),
      description: form.elements.description.value.trim(),
    };
    closeMeetingEditor();
    updateMeetingComposer();
    showToast("Hittingi bætt við færsluna");
    return;
  }

  if (form.dataset.form === "meeting-location") {
    const location = form.elements.location.value.trim();
    if (!location) {
      showToast("Skrifaðu staðsetningu");
      return;
    }
    meetingDraft.location = location;
    closeMeetingEditor();
    updateMeetingComposer();
    showToast("Staðsetningu bætt við færsluna");
    return;
  }

  if (form.dataset.form === "meeting") {
    const text = form.elements.post.value.trim();
    const hasContent = text
      || meetingDraft.attachments.length
      || meetingDraft.poll
      || meetingDraft.event
      || meetingDraft.location;
    if (!hasContent) {
      showToast("Skrifaðu færslu eða bættu við mynd, könnun eða hittingi");
      return;
    }

    const post = {
      id: editingMeetingId || String(Date.now()),
      text,
      attachments: [...meetingDraft.attachments],
      poll: meetingDraft.poll ? {
        ...meetingDraft.poll,
        options: [...meetingDraft.poll.options],
        votes: [...(meetingDraft.poll.votes || [])],
      } : null,
      event: meetingDraft.event ? { ...meetingDraft.event } : null,
      location: meetingDraft.location,
    };
    const existingIndex = meetingPosts.findIndex((item) => item.id === post.id);
    if (existingIndex >= 0) {
      meetingPosts[existingIndex] = post;
    } else {
      meetingPosts.unshift(post);
    }

    meetingDraft = { text: "", attachments: [], poll: null, event: null, location: "" };
    editingMeetingId = null;
    form.reset();
    closeMeetingEditor();
    updateMeetingComposer();
    renderMeetingPosts();
    showToast(existingIndex >= 0 ? "Breytingar á færslunni hafa verið vistaðar" : "Færslan hefur verið birt");
    return;
  }

  if (form.dataset.form === "meeting-vote") {
    const post = meetingPosts.find((item) => item.id === form.dataset.postId);
    const selectedOption = form.querySelector('input[name="vote"]:checked');
    if (!post || !post.poll) {
      showToast("Ekki tókst að finna könnunina");
      return;
    }
    if (!selectedOption) {
      showToast("Veldu svarmöguleika");
      return;
    }
    const optionIndex = Number(selectedOption.value);
    if (optionIndex < 0 || optionIndex >= post.poll.options.length) {
      showToast("Ógildur svarmöguleiki");
      return;
    }
    post.poll.votes = post.poll.votes || Array(post.poll.options.length).fill(0);
    post.poll.votes[optionIndex] = (Number(post.poll.votes[optionIndex]) || 0) + 1;
    post.poll.voted = true;
    renderMeetingPosts();
    showToast("Atkvæði skráð");
    return;
  }

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

function openMeetingEditor(type) {
  const editor = screen.querySelector("#meeting-editor");
  editor.innerHTML = renderMeetingEditor(type);
  editor.hidden = false;
  editor.querySelector("input, textarea")?.focus();
}

function closeMeetingEditor() {
  const editor = screen.querySelector("#meeting-editor");
  if (!editor) return;
  editor.hidden = true;
  editor.innerHTML = "";
}

function updateMeetingComposer() {
  const preview = screen.querySelector("#meeting-draft-preview");
  if (preview) preview.innerHTML = renderMeetingDraftPreview();

  const submitButton = screen.querySelector('[data-form="meeting"] [type="submit"]');
  if (submitButton) {
    submitButton.innerHTML = `${icon(icons.heart, "")}${editingMeetingId ? "Vista breytingar" : "Birta"}`;
  }
}

function renderMeetingPosts() {
  const list = screen.querySelector("#meeting-post-list");
  if (list) list.innerHTML = meetingPosts.map(renderMeetingPost).join("");
}

function updateNotificationCount() {
  const count = notificationDropdown.querySelectorAll(".notification-item:not(.read)").length;
  const badge = notificationButton.querySelector(".notification-count");
  badge.textContent = count > 9 ? "9+" : String(count);
  badge.hidden = count === 0;
  notificationButton.setAttribute(
    "aria-label",
    count ? `Tilkynningar, ${count} ólesnar` : "Tilkynningar",
  );
}

function setNotificationsOpen(open) {
  notificationDropdown.hidden = !open;
  notificationButton.setAttribute("aria-expanded", String(open));
}

function markAllNotificationsRead() {
  document.querySelectorAll(".notification-item").forEach((item) => item.classList.add("read"));
  updateNotificationCount();
  showToast("Allar tilkynningar skoðaðar");
}

function showToast(message) {
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 2600);
}
