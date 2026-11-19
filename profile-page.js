// Profile page specific JavaScript
// Handles loading and displaying user profile data

const icon = (file, alt = "") => `<img src="img/figma/${file}" alt="${alt}" />`;

const icons = {
  profileInfo: "46166371-541f-41e6-b9eb-d2806d455e69.svg",
  profileSettings: "64440be3-91d1-4ff2-ac55-0e2c6ef0270a.svg",
  profilePhotos: "6de23b7c-892e-4dd3-aa88-ffd3c33cacdc.svg",
  profileConnections: "600507bb-4e1d-4c45-976a-c8711ed17fbe.svg",
  plus: "fa8f4181-8499-46fe-868c-2b93e64b05e6.svg",
};

const asset = (file) => `img/figma/${file}`;

// Initialize profile page
(async () => {
  try {
    console.log("Profile page: Starting initialization...");
    
    // Check if user is authenticated
    const { auth } = await getFirebaseAuthClient();
    if (!auth.currentUser) {
      console.log("Profile page: User not authenticated, redirecting to login");
      window.location.href = "index.html";
      return;
    }

    console.log("Profile page: User authenticated:", auth.currentUser.email);

    // Load user profile data
    const profileData = await window.firebaseFirestore.getUserProfile(auth.currentUser.uid);
    console.log("Profile page: Got profile data:", profileData);

    // Render the profile
    const screenElement = document.getElementById("screen");
    const html = renderProfile(profileData, auth.currentUser);
    screenElement.innerHTML = html;

    // Attach event listeners
    attachProfileListeners(profileData);

  } catch (error) {
    console.error("Profile page: Error initializing:", error);
    const screenElement = document.getElementById("screen");
    screenElement.innerHTML = `
      <div style="padding: 40px; text-align: center;">
        <h2>Villa</h2>
        <p style="color: #999;">Mistók að hlaða prófílsgögnum</p>
        <p style="color: #e5518b; font-size: 12px;">${error.message}</p>
        <a href="app.html" style="color: #e5518b; text-decoration: none;">Fara til baka</a>
      </div>
    `;
  }
})();

function renderProfile(profileData, currentUser) {
  if (!profileData) {
    // No profile data yet - show onboarding
    return `
      <div class="profile-layout">
        <section class="profile-panel">
          <h2>Prófíllinn minn</h2>
          <nav aria-label="Prófílvalmynd">
            <a href="#profile">${icon(icons.profileInfo)}Prófílupplýsingar</a>
            <a href="#settings">${icon(icons.profileSettings)}Stillingar</a>
            <a href="#photos">${icon(icons.profilePhotos)}Myndir</a>
            <a href="#friends">${icon(icons.profileConnections)}Tengslabönd</a>
          </nav>
        </section>
        <section class="profile-panel profile-welcome" id="profile-content">
          <img src="${asset("5b0192a6-a345-4e38-857a-3b1c99641ecc.png")}" alt="Endalaus">
          <h1>Endalaus</h1>
          <p>Byrjaðu að fylla prófílinn!</p>
          <button class="button button-primary" type="button">${icon(icons.plus)}Byrjaðu</button>
        </section>
      </div>`;
  }

  // Display actual profile data
  const displayName = profileData.displayName || "Endalaus";
  const nickname = profileData.nickname || displayName;
  const photoUrl = profileData.photoPrivateUrl || asset("5b0192a6-a345-4e38-857a-3b1c99641ecc.png");
  const bio = profileData.bio || "";
  const interests = profileData.interests || [];
  const ageGroup = profileData.ageGroup || "";
  const currentAge = profileData.currentAge || "";

  // Build interests HTML
  const interestsHtml = interests.length > 0 
    ? `<p><strong>Áhugamál:</strong> ${interests.join(", ")}</p>`
    : "";

  // Build age HTML
  const ageHtml = currentAge || ageGroup 
    ? `<p class="profile-age"><strong>Aldur:</strong> ${currentAge || ageGroup}</p>`
    : "";

  return `
    <div class="profile-layout">
      <section class="profile-panel">
        <h2>Prófíllinn minn</h2>
        <nav aria-label="Prófílvalmynd">
          <a href="#profile">${icon(icons.profileInfo)}Prófílupplýsingar</a>
          <a href="#settings">${icon(icons.profileSettings)}Stillingar</a>
          <a href="#photos">${icon(icons.profilePhotos)}Myndir</a>
          <a href="#friends">${icon(icons.profileConnections)}Tengslabönd</a>
        </nav>
      </section>
      <section class="profile-panel" id="profile-content">
        <div class="profile-header">
          <img class="profile-photo" src="${photoUrl}" alt="${displayName}">
          <h2>${displayName}</h2>
          <p class="nickname">${nickname}</p>
          ${ageHtml}
        </div>
        <div class="profile-info">
          ${bio ? `<div class="profile-bio"><p>${bio}</p></div>` : ""}
          ${interestsHtml}
        </div>
      </section>
    </div>`;
}

function attachProfileListeners(profileData) {
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
      } else if (hash === 'photos') {
        content.innerHTML = `
          <div style="max-width: 400px;">
            <h2 style="margin-top: 0;">Myndir</h2>
            <p>Myndarstjórnun kemur seinna</p>
          </div>
        `;
      } else if (hash === 'friends') {
        content.innerHTML = `
          <div style="max-width: 400px;">
            <h2 style="margin-top: 0;">Tengslabönd</h2>
            <p>Vinnustjórnun tengsla kemur seinna</p>
          </div>
        `;
      } else {
        // Profile info - show basic profile
        content.innerHTML = renderProfile(profileData);
      }
    });
  });

  // Handle delete account action
  document.addEventListener('click', async (e) => {
    if (e.target.getAttribute('data-action') === 'delete-account') {
      await handleDeleteAccount();
    }
  });
}

async function handleDeleteAccount() {
  if (!confirm("Ertu viss um að þú viljir eyða þínum aðgangi? Þetta er óafturkræft.")) {
    return;
  }

  try {
    const { auth, authSdk } = await getFirebaseAuthClient();
    const user = auth.currentUser;

    if (!user) {
      alert("Engin notandi innskráð");
      return;
    }

    const userEmail = user.email;
    const password = prompt("Sláðu inn lykilorðið þitt til að staðfesta eyðingu aðgangs:");
    
    if (!password) {
      alert("Eyðingu aðgangs aflýst");
      return;
    }

    // Re-authenticate
    const credential = authSdk.EmailAuthProvider.credential(userEmail, password);
    await authSdk.reauthenticateWithCredential(user, credential);

    // Delete user profile from Firestore
    await window.firebaseFirestore.deleteUserProfile(user.uid);

    // Delete user account
    await user.delete();

    alert("Aðgangur eytt");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error deleting account:", error);
    alert("Villa við eyðingu aðgangs: " + error.message);
  }
}
