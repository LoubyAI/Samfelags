const asset = (file) => `img/figma/${file}`;

// Helper to redirect while respecting current environment (file:// or https://)
function redirectTo(path) {
  const currentUrl = window.location.href;
  let targetUrl;
  
  // If we're on a file:// URL, build the full file path
  if (currentUrl.startsWith('file://')) {
    const baseDir = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
    targetUrl = baseDir + path;
  } else {
    // On http(s), use relative path (will stay on same domain)
    targetUrl = path;
  }
  
  window.location.href = targetUrl;
}

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
  heart: "81db5627-9b7a-46f7-a1c2-28bbb48f24f9.svg?v=2",
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
const NEWS_POSTS_STORAGE_KEY = "new-friends-news-posts";
let newsPosts = [];
let editingNewsPostId = null;

const pageInfo = {
  home: { title: "Heim", icon: icons.home, active: "home" },
  news: { title: "Hvað er að frétta?", icon: icons.news, active: "news" },
  meetings: { title: "Hittingarspjall", icon: icons.meetings, active: "meetings" },
  "calendar-day": { title: "Viðburðir & dagatal", icon: icons.calendar, active: "calendar" },
  "calendar-week": { title: "Viðburðir & dagatal", icon: icons.calendar, active: "calendar" },
  "calendar-month": { title: "Viðburðir & dagatal", icon: icons.calendar, active: "calendar" },
  messages: { title: "Skilaboð", icon: icons.messages, active: "messages" },
  profile: { title: "Prófíll", icon: icons.profile, active: "profile" },
  "profile-setup": { title: "Prófíluppsetning", icon: icons.profile, active: "profile" },
  "photo-policy": { title: "Myndasjónarmið", icon: icons.photo, active: "profile" },
  login: { title: "Skrá inn", icon: icons.profile, active: "" },
};

function goToHomeIfAllowed(event) {
  event.preventDefault();
  const setupViews = ["login", "profile-setup", "photo-policy"];
  const current = new URLSearchParams(window.location.search).get("view") || "home";
  if (!setupViews.includes(current)) {
    redirectTo("app.html?view=home");
  }
}

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
  newsPosts = loadNewsPosts();
  editingNewsPostId = null;
  return `
    <div class="page-stack">
      <section class="content-card composer">
        <div class="composer-top">${avatar(photos.portrait, "Luna")}<strong>Búa til færslu</strong></div>
        <form class="composer-form" data-form="post">
          <input name="post" placeholder="Hvað viltu deila?" aria-label="Hvað viltu deila?" required>
          <button class="button button-primary" type="submit">Búa til færslu</button>
        </form>
      </section>
      <div class="user-news-posts" id="user-news-posts">${newsPosts.map(renderUserNewsPost).join("")}</div>
    </div>`;
}

function loadNewsPosts() {
  try {
    const storedPosts = localStorage.getItem(NEWS_POSTS_STORAGE_KEY);
    if (!storedPosts) return [];
    const posts = JSON.parse(storedPosts);
    if (!Array.isArray(posts) || posts.some((post) =>
      !post || typeof post.id !== "string" || typeof post.text !== "string")) {
      throw new TypeError("Saved news posts have an invalid format.");
    }
    return posts;
  } catch (error) {
    console.error("Unable to load saved news posts.", error);
    showToast("Ekki tókst að hlaða vistuðum færslum");
    return [];
  }
}

function saveNewsPosts(posts) {
  try {
    localStorage.setItem(NEWS_POSTS_STORAGE_KEY, JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error("Unable to save news posts.", error);
    showToast("Ekki tókst að vista færsluna");
    return false;
  }
}

function renderUserNewsPost(post) {
  const postId = escapeHtml(post.id);
  const editing = editingNewsPostId === post.id;
  const editForm = editing ? `<form class="news-post-edit-form" data-form="edit-news-post" data-post-id="${postId}">
      <textarea name="post" aria-label="Breyta færslu" required>${escapeHtml(post.text)}</textarea>
      <div class="news-post-edit-actions">
        <button class="button" type="button" data-action="cancel-edit-news-post">Hætta við</button>
        <button class="button button-primary" type="submit">Vista</button>
      </div>
    </form>` : `<p class="news-post-text">${escapeHtml(post.text)}</p>`;
  const actions = editing ? "" : `<details class="news-post-actions">
      <summary aria-label="Opna valkosti fyrir færslu" title="Valkostir">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="5" r="1.7" fill="currentColor"></circle>
          <circle cx="12" cy="12" r="1.7" fill="currentColor"></circle>
          <circle cx="12" cy="19" r="1.7" fill="currentColor"></circle>
        </svg>
      </summary>
      <div class="news-post-menu" role="group" aria-label="Aðgerðir á færslu">
        <button type="button" data-action="edit-news-post" data-post-id="${postId}">Breyta</button>
        <button class="danger-action" type="button" data-action="delete-news-post" data-post-id="${postId}">Eyða</button>
      </div>
    </details>`;

  return `<article class="content-card post-card user-news-post" data-searchable data-news-post-id="${postId}">
    <div class="user-news-post-heading">
      <h2 class="panel-heading">${icon(icons.news)}Ný færsla</h2>
      ${actions}
    </div>
    <div class="user-news-post-content">
      <div class="post-author">${avatar(photos.portrait, "Luna")}<span>Luna<small>Núna</small></span></div>
      ${editForm}
    </div>
    <img class="post-photo" src="${asset(photos.largeOutdoor)}" alt="Vinahópur saman úti">
  </article>`;
}

function renderUserNewsPosts() {
  const postList = screen.querySelector("#user-news-posts");
  if (postList) postList.innerHTML = newsPosts.map(renderUserNewsPost).join("");
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
        <button class="message-filter" type="button" data-action="toggle-conversations" aria-label="Sýna vistuð samtöl" aria-expanded="false" aria-controls="saved-conversations">
          <svg class="message-filter-arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
          </svg>
        </button>
        <div class="saved-conversations" id="saved-conversations" hidden>
          <p>Engin vistuð samtöl ennþá.</p>
        </div>
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

async function renderProfile() {
  try {
    console.log("renderProfile: Starting to load profile...");
    
    // Load user profile from Firebase
    const { auth } = await getFirebaseAuthClient();
    console.log("renderProfile: Got auth client, currentUser:", auth.currentUser?.email);
    
    if (!auth.currentUser) {
      console.log("renderProfile: No current user, showing loading message");
      return `<div style="padding: 20px;"><p>Endalaust hleðsla notandagagna...</p></div>`;
    }

    console.log("renderProfile: Fetching profile data for user:", auth.currentUser.uid);
    const profileData = await window.firebaseFirestore.getUserProfile(auth.currentUser.uid);
    console.log("renderProfile: Got profile data:", profileData);
    
    if (!profileData) {
      console.log("renderProfile: No profile data found");
      return `
        <div class="profile-layout">
          <section class="profile-panel">
            <h2>Prófíllinn minn</h2>
            <nav aria-label="Prófílvalmynd">
              <a href="profileinfo.html">${icon(icons.profileInfo, "")}Prófílupplýsingar</a>
              <a href="#settings">${icon(icons.profileSettings, "")}Stillingar</a>
              <a href="#photos">${icon(icons.profilePhotos, "")}Myndir</a>
              <a href="#friends">${icon(icons.profileConnections, "")}Tengslabönd</a>
            </nav>
          </section>
          <section class="profile-panel profile-welcome" id="profile-content">
            <img src="${asset("5b0192a6-a345-4e38-857a-3b1c99641ecc.png")}" alt="Endalaus">
            <h1>Endalaus</h1>
            <p>Byrjaðu að fylla prófílinn!</p>
            <button class="button button-primary" type="button">${icon(icons.plus, "")}Byrjaðu</button>
          </section>
        </div>`;
    }

    const displayName = profileData.displayName || "Endalaus";
    const nickname = profileData.nickname || displayName;
    const photoUrl = profileData.photoPrivateUrl || asset("5b0192a6-a345-4e38-857a-3b1c99641ecc.png");
    const bio = profileData.bio || "";
    const interests = profileData.interests || [];

    console.log("renderProfile: Rendering profile for", displayName);
    return `
      <div class="profile-layout">
        <section class="profile-panel">
          <h2>Prófíllinn minn</h2>
          <nav aria-label="Prófílvalmynd">
            <a href="profileinfo.html">${icon(icons.profileInfo, "")}Prófílupplýsingar</a>
            <a href="#settings">${icon(icons.profileSettings, "")}Stillingar</a>
            <a href="#photos">${icon(icons.profilePhotos, "")}Myndir</a>
            <a href="#friends">${icon(icons.profileConnections, "")}Tengslabönd</a>
          </nav>
        </section>
        <section class="profile-panel profile-welcome" id="profile-content">
          <img src="${photoUrl}" alt="${displayName}">
          <h1>${nickname}</h1>
          <p>${bio || "Engin lýsing ennþá"}</p>
          <div style="margin-top: 16px; font-size: 12px; color: #999;">
            ${interests.length > 0 ? `<p>Áhugamál: ${interests.join(", ")}</p>` : ""}
          </div>
        </section>
      </div>`;
  } catch (error) {
    console.error("Error loading profile:", error);
    console.error("Error stack:", error.stack);
    return `<div style="padding: 20px;"><p>Villa við hleðslu prófíls: ${error.message}</p></div>`;
  }
}

function renderPhotoPolicy() {
  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div class="logo-section" style="text-align: center; margin-bottom: 40px; border-bottom: 1px solid #e0e0e0; padding-bottom: 30px;">
        <h1 style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 0 0 12px 0; font-size: 32px; font-weight: 600; font-family: 'Poppins', Arial, sans-serif;">
          <img src="${asset(icons.people)}" alt="New Friends" style="width: 32px; height: 32px;">
          New Friends
        </h1>
        <p class="tagline" style="color: #e5518b; font-size: 16px; font-weight: 500; margin: 0;">Connect · Meet · Build Friendships</p>
        <p class="step-indicator" style="color: #e5518b; font-size: 12px; margin-top: 12px; font-weight: 600;">Skref 2 af 2 | Myndir</p>
      </div>

      <form id="photoForm" data-form="photo-policy">
        <div class="form-section" style="margin-bottom: 30px;">
          <!-- Private Photo Section -->
          <div class="form-group" style="margin-bottom: 25px;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 10px;">Prófílmynd fyrir vini og áhugamálahópa (Áskilið)</label>
            <div class="photo-upload-area" style="border: 2px dashed #e5518b; border-radius: 8px; padding: 40px; text-align: center; background: #fff1f3; cursor: pointer; margin-bottom: 12px;" onclick="this.querySelector('input').click()">
              <svg class="upload-icon" style="width: 48px; height: 48px; margin: 0 auto 8px; color: #e5518b;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              <div class="upload-text" style="color: #e5518b; font-weight: 600; margin-bottom: 4px; font-size: 14px;">Dragðu mynd hingað</div>
              <div class="upload-subtext" style="color: #999; font-size: 12px;">eða smelltu til að velja</div>
              <input type="file" name="photoPrivate" accept="image/*" required>
            </div>
            <small style="display: block; color: #999; font-size: 10px; margin-top: 6px; line-height: 1.4;">Alvöru mynd af þér. JPG, PNG eða GIF (hámark 5MB)</small>
            <div class="visibility-info" style="background: #fff1f3; border-left: 3px solid #e5518b; padding: 12px; border-radius: 6px; font-size: 12px; color: #333; margin-top: 10px; line-height: 1.6;">
              <strong style="color: #e5518b; display: block; margin-bottom: 6px;">Hverjir sjá þessa mynd?</strong>
              Prófílmyndir sem birtast eingöngu samþykkta vini og meðlimi í áhugamálahópa þína
            </div>
          </div>

          <!-- Public Photo Section -->
          <div class="form-group" style="margin-bottom: 25px;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 10px;">Mynd fyrir almenning (Valfrjálst)</label>
            <div class="photo-upload-area" style="border: 2px dashed #e5518b; border-radius: 8px; padding: 40px; text-align: center; background: #fff1f3; cursor: pointer; margin-bottom: 12px;" onclick="this.querySelector('input').click()">
              <svg class="upload-icon" style="width: 48px; height: 48px; margin: 0 auto 8px; color: #e5518b;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              <div class="upload-text" style="color: #e5518b; font-weight: 600; margin-bottom: 4px; font-size: 14px;">Dragðu mynd hingað</div>
              <div class="upload-subtext" style="color: #999; font-size: 12px;">eða smelltu til að velja</div>
              <input type="file" name="photoPublic" accept="image/*">
            </div>
            <div class="visibility-info" style="background: #fff1f3; border-left: 3px solid #e5518b; padding: 12px; border-radius: 6px; font-size: 12px; color: #333; margin-top: 10px; line-height: 1.6;">
              <strong style="color: #e5518b; display: block; margin-bottom: 6px;">Hverjir sjá þessa mynd?</strong>
              Allir notendur á New Friends
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
          <a href="#" class="policy-link" onclick="showPhotoModal(); return false;" style="color: #e5518b; text-decoration: none; font-weight: 600;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#e5518b" stroke-width="2" style="display: inline-block; width: 12px; height: 12px; margin-right: 8px; vertical-align: middle;">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
            Skoðaðu reglur New Friends fyrir myndir
          </a>
        </div>

        <div class="button-group" style="display: flex; gap: 12px; margin-top: 30px;">
          <button type="button" class="button button-secondary" onclick="skipToHome()" style="flex: 1; padding: 12px 24px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; background: #f0f0f0; color: #333;">
            Sleppa þessu skrefi
          </button>
          <button type="submit" class="button button-primary" style="flex: 1; padding: 12px 24px; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; background: #e5518b; color: white;">
            Halda áfram →
          </button>
        </div>
      </form>
    </div>
  `;
}

async function renderLogin() {
  try {
    const response = await fetch('index.html');
    const html = await response.text();
    
    // Extract the body content (everything between <body> tags)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const bodyContent = Array.from(doc.body.childNodes)
      .map(node => node.outerHTML || node.textContent)
      .join('');
    
    return bodyContent;
  } catch (error) {
    console.error('Failed to load index.html:', error);
    return '<p>Mistók að hlaða innskráningarsíðu</p>';
  }
}

const view = new URLSearchParams(window.location.search).get("view") || "home";
console.log("===== APP LOADING =====");
console.log("Current view:", view);
console.log("Current URL:", window.location.href);

// If login view is requested, redirect to index.html instead
if (view === "login") {
  redirectTo("index.html");
}

// Initialize app - wrap in async IIFE to handle async auth checks
(async () => {
  console.log("===== ASYNC INIT START =====");
  // Check if user needs to be redirected to login (unless already on a setup view)
  const setupViews = ["login", "profile-setup", "photo-policy"];
  if (!setupViews.includes(view)) {
    console.log("View is NOT a setup view, checking auth...");
    // For app views (home, news, profile, etc), check if user is authenticated
    try {
      console.log("Getting Firebase auth client...");
      const { auth, authSdk } = await getFirebaseAuthClient();
      console.log("Auth client retrieved. currentUser:", auth.currentUser?.email);
      
      // Wait for auth state to initialize if currentUser is null
      if (!auth.currentUser) {
        console.log("currentUser is null, waiting for auth state to initialize...");
        const resolvedUser = await new Promise((resolve) => {
          const unsubscribe = authSdk.onAuthStateChanged(auth, (user) => {
            console.log("onAuthStateChanged fired, user:", user?.email);
            unsubscribe();
            resolve(user);
          });
          // Timeout after 2 seconds
          setTimeout(() => {
            console.log("Auth state wait timeout");
            unsubscribe();
            resolve(null);
          }, 2000);
        });
        console.log("After waiting, auth.currentUser:", auth.currentUser?.email);
      }
      
      if (!auth.currentUser) {
        // User is not logged in, redirect to index.html
        console.log("USER NOT AUTHENTICATED - Redirecting to login");
        redirectTo("index.html");
        return;
      }
      console.log("User authenticated:", auth.currentUser.email);
    } catch (error) {
      console.error("Error checking auth status:", error);
      redirectTo("index.html");
      return;
    }
  } else {
    console.log("View IS a setup view, skipping auth check");
  }

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
    "profile-setup": () => window.firebaseProfile?.renderProfileSetup() || "<p>Loading profile setup...</p>",
    "photo-policy": renderPhotoPolicy,
    login: renderLogin,
  };

  const isSetupView = ["login", "profile-setup", "photo-policy"].includes(current);
  document.body.classList.toggle("login-view", isSetupView);
  document.title = `${pageInfo[current].title} - New Friends`;
  const pageHeading = document.getElementById("page-heading");
  if (pageHeading) {
    pageHeading.innerHTML = `${icon(pageInfo[current].icon, "")}<span>${pageInfo[current].title}</span>`;
  }

  const screenElement = document.getElementById("screen");
  const result = renderers[current]();
  if (result instanceof Promise) {
    result.then(html => { screenElement.innerHTML = html; attachProfileListeners(); }).catch(err => console.error('Render error:', err));
  } else {
    screenElement.innerHTML = result;
    attachProfileListeners();
  }
})();

function attachProfileListeners() {
  if (current !== "profile") return;
  document.querySelectorAll('.profile-panel nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const hash = new URL(link.href).hash.slice(1);
      const content = document.getElementById('profile-content');
      
      if (hash === 'settings') {
        content.innerHTML = `
          <div style="max-width: 400px;">
            <h2 style="margin-top: 0;">Stillingar</h2>
            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 20px;">
              <h3 style="color: #e5518b; font-size: 14px; font-weight: 600; margin-bottom: 12px;">Aðgangastjórnun</h3>
              <button class="button button-primary" type="button" data-action="delete-account" style="background: #e5518b; width: 100%; padding: 12px 24px; border: none; border-radius: 6px; color: white; font-weight: 600; cursor: pointer; font-size: 14px;">
                Eyða aðgangi
              </button>
              <small style="display: block; color: #999; font-size: 12px; margin-top: 8px; line-height: 1.4;">
                Allt gögn þín verða eytt og ekki mögulegt að endurheimta
              </small>
            </div>
          </div>
        `;
      } else {
        content.innerHTML = `
          <img src="${asset("5b0192a6-a345-4e38-857a-3b1c99641ecc.png")}" alt="Luna A. Jónasdóttir">
          <h1>Luna A. Jónasdóttir</h1>
          <p>Byrjaðu að fylla prófílinn!</p>
          <button class="button button-primary" type="button">${icon(icons.plus, "")}Byrjaðu</button>
        `;
      }
    });
  });
}

document.querySelectorAll(".side-nav [data-view]").forEach((link) => {
  if (link.dataset.view === pageInfo[current].active) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

const screen = document.getElementById("screen");
const notificationButton = document.querySelector(".notification-button");
const notificationDropdown = document.getElementById("notifications-dropdown");
notificationDropdown.innerHTML = renderNotificationsDropdown();
updateNotificationCount();

screen.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "edit-news-post") {
    const post = newsPosts.find((item) => item.id === button.dataset.postId);
    if (!post) {
      showToast("Ekki tókst að finna færsluna");
      return;
    }
    editingNewsPostId = post.id;
    renderUserNewsPosts();
    screen.querySelector(".news-post-edit-form textarea")?.focus();
    return;
  }

  if (button.dataset.action === "cancel-edit-news-post") {
    editingNewsPostId = null;
    renderUserNewsPosts();
    return;
  }

  if (button.dataset.action === "delete-news-post") {
    const post = newsPosts.find((item) => item.id === button.dataset.postId);
    if (!post) {
      showToast("Ekki tókst að finna færsluna");
      return;
    }
    if (!window.confirm("Ertu viss um að þú viljir eyða þessari færslu?")) return;
    const updatedPosts = newsPosts.filter((item) => item.id !== post.id);
    if (!saveNewsPosts(updatedPosts)) return;
    newsPosts = updatedPosts;
    editingNewsPostId = null;
    renderUserNewsPosts();
    showToast("Færslunni hefur verið eytt");
    return;
  }

  if (button.dataset.action === "meeting-poll") {
    openMeetingEditor("poll");
    return;
  }

  if (button.dataset.action === "toggle-conversations") {
    const savedConversations = screen.querySelector("#saved-conversations");
    const expanded = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(expanded));
    button.setAttribute("aria-label", expanded ? "Fela vistuð samtöl" : "Sýna vistuð samtöl");
    savedConversations.hidden = !expanded;
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
    void handlePasswordReset(button);
    return;
  }

  if (button.dataset.action === "google-login") {
    void handleGoogleSignIn(button);
    return;
  }

  if (button.dataset.action === "toggle-auth-mode") {
    const form = screen.querySelector('[data-form="login"], [data-form="signup"]');
    if (form) setAuthMode(form.dataset.form !== "signup");
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

document.querySelector('[data-action="sign-out"]')?.addEventListener("click", (event) => {
  event.preventDefault();
  void handleFirebaseSignOut();
});

document.querySelector('body')?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="delete-account"]');
  if (button) {
    event.preventDefault();
    void handleDeleteAccount();
  }
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

  if (form.dataset.form === "login" || form.dataset.form === "signup") {
    void handleEmailAuth(form);
    return;
  }

  if (form.dataset.form === "profile-setup") {
    void handleProfileSetupSubmit(form);
    return;
  }

  if (form.dataset.form === "photo-policy") {
    void handlePhotoPolicySubmit(form);
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

  if (form.dataset.form === "edit-news-post") {
    const text = form.elements.post.value.trim();
    const postIndex = newsPosts.findIndex((post) => post.id === form.dataset.postId);
    if (postIndex < 0) {
      showToast("Ekki tókst að finna færsluna");
      return;
    }
    if (!text) {
      showToast("Færslan má ekki vera tóm");
      return;
    }
    const updatedPosts = newsPosts.map((post, index) =>
      index === postIndex ? { ...post, text } : post);
    if (!saveNewsPosts(updatedPosts)) return;
    newsPosts = updatedPosts;
    editingNewsPostId = null;
    renderUserNewsPosts();
    showToast("Breytingar á færslunni hafa verið vistaðar");
    return;
  }

  if (form.dataset.form === "post") {
    const text = form.elements.post.value.trim();
    if (!text) return;
    const post = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text,
    };
    const updatedPosts = [post, ...newsPosts];
    if (!saveNewsPosts(updatedPosts)) return;
    newsPosts = updatedPosts;
    renderUserNewsPosts();
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

async function handleGoogleSignIn(button) {
  clearAuthMessage();
  button.disabled = true;
  button.setAttribute("aria-busy", "true");

  try {
    await import("./firebase-auth.js?v=2");
    const result = await window.firebaseAuth.signInWithGoogle();
    const user = result.user;
    
    await import("./firebase-firestore.js?v=1");
    const isComplete = await window.firebaseFirestore.hasCompletedProfile(user.uid);
    
    if (isComplete) {
      showAuthMessage("Welkomin aftur!");
    }
    
    redirectTo(isComplete ? "app.html?view=home" : "profile-setup1.html");
  } catch (error) {
    const form = screen.querySelector('[data-form="login"], [data-form="signup"]');
    const isSignupMode = form && form.dataset.form === "signup";
    
    if (error.code === "app/firebase-config-missing") {
      showAuthMessage("Bættu Firebase-vefstillingum við til að virkja Google-innskráningu");
    } else if (error.code === "auth/popup-closed-by-user") {
      showAuthMessage("Innskráningu var hætt við");
    } else if (error.code === "auth/unauthorized-domain") {
      showAuthMessage("Þetta lén þarf að vera heimilað í Firebase");
    } else if (error.code === "auth/operation-not-allowed") {
      showAuthMessage("Virkjaðu Google-innskráningu í Firebase");
    } else if (error.code === "auth/popup-blocked") {
      showAuthMessage("Vafrinn lokaði innskráningarglugganum. Leyfðu sprettiglugga.");
    } else {
      console.error("Google sign-in failed", error);
      if (isSignupMode) {
        showAuthMessage("Þessi google aðgangur er nú þegar skráður");
      } else {
        showAuthMessage("Ekki tókst að skrá inn með Google");
      }
    }
  } finally {
    button.disabled = false;
    button.removeAttribute("aria-busy");
  }
}

function setAuthMode(signingUp) {
  const form = screen.querySelector('[data-form="login"], [data-form="signup"]');
  if (!form) return;

  form.dataset.form = signingUp ? "signup" : "login";
  form.querySelectorAll("[data-auth-signup]").forEach((field) => {
    field.hidden = !signingUp;
    if (field.matches("input")) {
      field.required = signingUp;
      if (signingUp && field.name === "displayName") field.value = "";
    }
  });

  const title = screen.querySelector("[data-auth-title]");
  const subtitle = screen.querySelector("[data-auth-subtitle]");
  const forgotPassword = form.querySelector('[data-action="forgot-password"]');
  const submitButton = form.querySelector('[type="submit"]');
  const togglePrompt = screen.querySelector("[data-auth-toggle-prompt]");
  const toggleButton = screen.querySelector('[data-action="toggle-auth-mode"]');
  const passwordInput = form.elements.password;

  clearAuthMessage();
  title.textContent = signingUp ? "Búðu til aðgang" : "Velkomin aftur!";
  subtitle.textContent = signingUp
    ? "Skráðu þig til að taka þátt í New Friends."
    : "Skráðu þig inn til að halda áfram.";
  forgotPassword.hidden = signingUp;
  submitButton.textContent = signingUp ? "Búa til aðgang" : "Skrá inn";
  togglePrompt.textContent = signingUp ? "Ertu nú þegar með aðgang?" : "Ný í New Friends?";
  toggleButton.textContent = signingUp ? "Skrá inn" : "Búðu til aðgang";
  passwordInput.autocomplete = signingUp ? "new-password" : "current-password";
}

async function handleEmailAuth(form) {
  const signingUp = form.dataset.form === "signup";
  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;
  const submitButton = form.querySelector('[type="submit"]');

  if (signingUp) {
    if (password !== form.elements.passwordConfirm.value) {
      showAuthMessage("Lykilorðin passa ekki saman");
      return;
    }
  }

  clearAuthMessage();
  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  try {
    await import("./firebase-auth.js?v=2");
    if (signingUp) {
      await window.firebaseAuth.createAccount(
        email,
        password,
      );
      redirectTo("profile-setup1.html");
    } else {
      await window.firebaseAuth.signInWithEmail(email, password);
      await import("./firebase-firestore.js?v=1");
      const { auth, authSdk } = await getFirebaseAuthClient();
      const user = authSdk.currentUser;
      const isComplete = await window.firebaseFirestore.hasCompletedProfile(user.uid);
      redirectTo(isComplete ? "app.html?view=home" : "profile-setup1.html");
    }
  } catch (error) {
    const message = getEmailAuthErrorMessage(error, signingUp);
    if (message) {
      showAuthMessage(message);
      if (!signingUp && (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password")) {
        const forgotPassword = form.querySelector('[data-action="forgot-password"]');
        if (forgotPassword) forgotPassword.hidden = false;
      }
    } else {
      console.error(signingUp ? "Account creation failed" : "Email sign-in failed", error);
      showAuthMessage(signingUp
        ? "Ekki tókst að búa til aðgang"
        : "Ekki tókst að skrá inn");
    }
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
  }
}

async function handlePasswordReset(button) {
  const email = screen.querySelector("#login-email").value.trim();
  if (!email) {
    showAuthMessage("Sláðu inn netfangið þitt fyrst");
    return;
  }

  button.disabled = true;
  clearAuthMessage();
  try {
    await import("./firebase-auth.js?v=2");
    await window.firebaseAuth.sendPasswordResetEmail(email);
    showAuthMessage("Leiðbeiningar um endurstillingu voru sendar í tölvupósti", "success");
  } catch (error) {
    const message = getEmailAuthErrorMessage(error, false);
    if (message) {
      showAuthMessage(message);
    } else {
      console.error("Password reset failed", error);
      showAuthMessage("Ekki tókst að senda endurstillingarpóst");
    }
  } finally {
    button.disabled = false;
  }
}

async function handleProfileSetupSubmit(form) {
  const submitButton = form.querySelector('[type="submit"]');
  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");

  try {
    await import("./firebase-auth.js?v=2");
    await import("./firebase-firestore.js?v=1");
    
    const displayName = form.elements.displayName?.value.trim() || "";
    const nickname = form.elements.nickname?.value.trim() || "";
    const birthday = form.elements.birthday?.value || "";
    const city = form.elements.city?.value.trim() || "";
    const photoPrivate = form.elements.photoPrivate?.files?.[0];
    const photoPublic = form.elements.photoPublic?.files?.[0];

    // Get current user
    const { auth, authSdk } = await getFirebaseAuthClient();
    const user = authSdk.currentUser;
    const isOwner = window.ownerConfig?.isOwner(user?.email);

    if (!displayName || !birthday) {
      showToast("Vinsamlegast fylltu út nafn og fæðingardag");
      return;
    }

    // For non-owner users, photos are required
    if (!isOwner && !photoPrivate) {
      showToast("Vinsamlegast bættu við mynd af þér");
      return;
    }

    const profileData = {
      displayName,
      nickname,
      birthday,
      city,
      photoPrivateUrl: null,
      photoPublicUrl: null,
      isOwner: Boolean(isOwner),
    };

    if (photoPrivate) {
      profileData.photoPrivateUrl = URL.createObjectURL(photoPrivate);
    }
    if (photoPublic) {
      profileData.photoPublicUrl = URL.createObjectURL(photoPublic);
    }

    await window.firebaseFirestore.saveUserProfile(profileData);

    // Owner goes straight to home, other users go to photo policy page
    if (isOwner) {
      redirectTo("app.html?view=home");
    } else {
      redirectTo("profile-setup2.html");
    }
  } catch (error) {
    console.error("Profile setup failed", error);
    showToast("Ekki tókst að vista prófílinn. Reyndu aftur.");
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
  }
}

async function getFirebaseAuthClient() {
  const { auth, authSdk } = await Promise.all([
    import("https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js"),
  ]).then(([appSdk, authSdk]) => {
    const app = appSdk.initializeApp(window.firebaseConfig);
    const auth = authSdk.getAuth(app);
    return { auth, authSdk };
  });
  return { auth, authSdk };
}

async function handlePhotoPolicySubmit(form) {
  const submitButton = form.querySelector('[type="submit"]');
  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");

  try {
    await import("./firebase-auth.js?v=2");
    await import("./firebase-firestore.js?v=1");
    
    const photoPrivate = form.elements.photoPrivate?.files?.[0];
    const photoPublic = form.elements.photoPublic?.files?.[0];

    // Photos are required at this stage (owner already skipped)
    if (!photoPrivate) {
      showToast("Vinsamlegast bættu við mynd af þér");
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      return;
    }

    const profileData = {
      photoPrivateUrl: null,
      photoPublicUrl: null,
    };

    if (photoPrivate) {
      profileData.photoPrivateUrl = URL.createObjectURL(photoPrivate);
    }
    if (photoPublic) {
      profileData.photoPublicUrl = URL.createObjectURL(photoPublic);
    }

    // Try to save to Firestore, but proceed to home anyway after a timeout
    try {
      const savePromise = window.firebaseFirestore.saveUserProfile(profileData);
      await Promise.race([
        savePromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Save timeout")), 5000))
      ]);
    } catch (saveError) {
      console.warn("Could not save to Firestore, but proceeding to home anyway", saveError);
      // Don't throw - we still want to proceed to home
    }

    // Always redirect to profile after submission
    redirectTo("app.html?view=profile");
  } catch (error) {
    console.error("Photo policy submission failed", error);
    showToast("Ekki tókst að vista myndirnar. Reyndu aftur.");
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
  }
}

function getEmailAuthErrorMessage(error, signingUp) {
  switch (error.code) {
    case "app/firebase-config-missing":
      return "Bættu Firebase-vefstillingum við til að virkja innskráningu";
    case "app/profile-update-failed":
      return "Aðgangur var stofnaður en ekki tókst að vista nafnið. Skráðu þig inn aftur.";
    case "auth/email-already-in-use":
      return signingUp ? "Þú ert nú þegar með aðgang á þessari vefsíðu með þessu netfangi. Skráðu þig inn í staðinn." : "Ekki tókst að búa til aðgang";
    case "auth/invalid-email":
      return "Netfangið er ekki gilt";
    case "auth/weak-password":
      return "Lykilorðið þarf að vera að minnsta kosti 6 stafir";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return signingUp ? "Ekki tókst að búa til aðgang" : "Netfang eða lykilorð er rangt";
    case "auth/operation-not-allowed":
      return "Virkjaðu Email/Password innskráningu í Firebase";
    case "auth/unauthorized-domain":
      return "Þetta lén þarf að vera heimilað í Firebase";
    case "auth/too-many-requests":
      return "Of margar tilraunir. Reyndu aftur síðar";
    case "auth/network-request-failed":
      return "Tengingin mistókst. Athugaðu nettenginguna";
    case "auth/missing-email":
      return "Sláðu inn netfangið þitt";
    default:
      return null;
  }
}

function showAuthMessage(message, state = "error") {
  const messageElement = screen.querySelector("[data-auth-message]");
  if (!messageElement) {
    showToast(message);
    return;
  }
  messageElement.textContent = message;
  messageElement.dataset.state = state;
  messageElement.hidden = !message;
}

function clearAuthMessage() {
  const messageElement = screen.querySelector("[data-auth-message]");
  if (!messageElement) return;
  messageElement.textContent = "";
  messageElement.hidden = true;
  delete messageElement.dataset.state;
}

async function handleFirebaseSignOut() {
  try {
    await import("./firebase-auth.js?v=2");
    await window.firebaseAuth.signOut();
    redirectTo("index.html");
  } catch (error) {
    console.error("Firebase sign-out failed", error);
    showToast("Ekki tókst að skrá út");
  }
}

async function handleDeleteAccount() {
  if (!confirm("Ertu viss um að þú viljir eyða aðgangnum þínum? Þetta er óafturkræft.")) {
    return;
  }

  if (!confirm("Allt gögn þín verða eytt. Ertu viss?")) {
    return;
  }

  if (!confirm("Allt gögn þín munu vera endalaust eytt. Ertu alveg viss?")) {
    return;
  }

  try {
    console.log("=== Starting account deletion ===");
    
    await import("./firebase-auth.js?v=2");
    await import("./firebase-firestore.js?v=1");
    
    const { auth, authSdk } = await window.firebaseAuth.getAuthClient();
    console.log("Got auth client");
    
    // Try to get current user, but wait if not ready yet
    let user = auth.currentUser;
    console.log("Current user (immediate):", user ? user.uid : "none");
    
    if (!user) {
      console.log("No current user, waiting for auth state to load...");
      // Wait for auth state to initialize
      user = await new Promise((resolve) => {
        const unsubscribe = authSdk.onAuthStateChanged(auth, (currentUser) => {
          console.log("Auth state changed, user:", currentUser ? currentUser.uid : "none");
          unsubscribe();
          resolve(currentUser);
        });
        
        // Timeout after 3 seconds
        setTimeout(() => {
          console.log("Auth state wait timeout");
          unsubscribe();
          resolve(null);
        }, 3000);
      });
    }
    
    console.log("Current user (after wait):", user ? user.uid : "none");
    
    if (!user) {
      showToast("Engin notandi innskráð");
      console.error("No user logged in after waiting");
      return;
    }

    const userId = user.uid;
    const userEmail = user.email;
    console.log("Deleting account for user:", userId, userEmail);

    // Always require password confirmation for security
    console.log("Requesting password confirmation...");
    const password = prompt("Sláðu inn lykilorðið þitt til að staðfesta eyðingu aðgangs:");
    
    if (!password) {
      showToast("Eyðingu aðgangs aflýst");
      console.log("User cancelled password entry");
      return;
    }

    let deleteSucceeded = false;
    
    // Re-authenticate with password first (always required)
    try {
      console.log("Re-authenticating with email:", userEmail);
      const credential = authSdk.EmailAuthProvider.credential(userEmail, password);
      await authSdk.reauthenticateWithCredential(user, credential);
      console.log("✓ Re-authentication successful");
    } catch (reauthError) {
      console.error("✗ Re-authentication failed:", reauthError.code, reauthError.message);
      if (reauthError.code === "auth/wrong-password") {
        showToast("Rangt lykilorð");
      } else {
        showToast("Villa: " + reauthError.message);
      }
      return;
    }
    
    // Now that user is re-authenticated, delete Firestore profile
    try {
      console.log("Deleting Firestore profile...");
      await window.firebaseFirestore.deleteUserProfile(userId);
      console.log("✓ Firestore profile deleted");
    } catch (firestoreError) {
      console.warn("✗ Firestore delete failed:", firestoreError);
      // Continue with auth deletion even if Firestore fails
    }
    
    // Delete from Firebase Auth
    try {
      console.log("Deleting Firebase Auth account...");
      await user.delete();
      deleteSucceeded = true;
      console.log("✓ Firebase Auth account deleted successfully");
    } catch (authError) {
      console.error("✗ Auth deletion error:", authError.code, authError.message);
      showToast("Villa: " + authError.message);
      return;
    }
    
    if (deleteSucceeded) {
      console.log("=== Account deletion successful ===");
      showToast("Aðgangur og öll gögn eytt!");
      
      try {
        await authSdk.signOut(auth);
        console.log("Signed out");
      } catch (e) {
        console.log("Sign out error (expected after deletion):", e.message);
      }
      
      setTimeout(() => {
        console.log("Redirecting to login...");
        redirectTo("index.html");
      }, 1500);
    }
  } catch (error) {
    console.error("=== Unexpected error ===", error);
    showToast("Villa: " + (error.message || error));
  }
        console.error("Cannot continue without solving:", authError.code);
        return;
      }
    }
    
    if (deleteSucceeded) {
      console.log("=== Account deletion successful ===");
      showToast("Aðgangur eytt!");
      
      try {
        await authSdk.signOut(auth);
        console.log("Signed out");
      } catch (e) {
        console.log("Sign out error (expected after deletion):", e.message);
      }
      
      setTimeout(() => {
        console.log("Redirecting to login...");
        redirectTo("index.html");
      }, 1500);
    } else {
      console.error("=== Account deletion FAILED ===");
      showToast("Eyðingu misheppnuð");
    }
  } catch (error) {
    console.error("=== Unexpected error ===", error);
    showToast("Villa: " + (error.message || error));
  }
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

function skipToHome() {
  redirectTo("app.html?view=home");
}
