// Profile page specific JavaScript
// Handles loading and displaying user profile data

// Initialize profile page
(async () => {
  try {
    console.log("Profile page: Starting initialization...");
    
    // Check if user is authenticated
    const { auth } = await getFirebaseAuthClient();
    console.log("Profile page: Auth client loaded, currentUser:", auth.currentUser?.email);
    
    if (!auth.currentUser) {
      console.log("Profile page: User not authenticated, redirecting to login");
      window.location.href = "index.html";
      return;
    }

    console.log("Profile page: User authenticated:", auth.currentUser.email);
    console.log("Profile page: Attempting to load profile from Firestore...");

    // Load user profile data
    const profileData = await window.firebaseFirestore.getUserProfile(auth.currentUser.uid);
    console.log("Profile page: Got profile data:", profileData);

    // Render the profile
    const contentElement = document.getElementById("profile-content");
    
    if (!profileData) {
      console.log("Profile page: No profile data found - show setup prompt");
      renderEmptyProfile(contentElement);
    } else {
      renderProfile(contentElement, profileData, auth.currentUser);
    }

    // Attach event listeners
    attachTabListeners();
    attachSettingsListeners();

  } catch (error) {
    console.error("Profile page: Error initializing:", error);
    const contentElement = document.getElementById("profile-content");
    contentElement.innerHTML = `
      <div style="padding: 40px; text-align: center;">
        <h2>Villa</h2>
        <p style="color: #999;">Mistók að hlaða prófílsgögnum</p>
        <p style="color: #e5518b; font-size: 12px;">${error.message}</p>
        <p style="color: #999; font-size: 11px; margin-top: 20px;">Error details: ${error.code || 'unknown'}</p>
        <a href="app.html" style="color: #e5518b; text-decoration: none; display: inline-block; margin-top: 20px;">Fara til baka</a>
      </div>
    `;
  }
})();

function renderEmptyProfile(container) {
  container.innerHTML = `
    <div class="profile-welcome">
      <img src="img/figma/5b0192a6-a345-4e38-857a-3b1c99641ecc.png" alt="Endalaus">
      <h1>Endalaus</h1>
      <p>Byrjaðu að fylla prófílinn!</p>
      <a href="profile-setup1.html" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #e5518b; color: white; border: none; border-radius: 6px; text-decoration: none; font-weight: 600; cursor: pointer;">
        <img src="img/figma/fa8f4181-8499-46fe-868c-2b93e64b05e6.svg" alt="" style="width: 16px; height: 16px;">
        Byrjaðu
      </a>
    </div>`;
}

function renderProfile(container, profileData, currentUser) {
  const displayName = profileData.displayName || "Endalaus";
  const nickname = profileData.nickname || displayName;
  const photoUrl = profileData.photoPrivateUrl || "img/figma/5b0192a6-a345-4e38-857a-3b1c99641ecc.png";
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

  container.innerHTML = `
    <div class="profile-header">
      <img class="profile-photo" src="${photoUrl}" alt="${displayName}">
      <h2>${displayName}</h2>
      <p class="nickname">${nickname}</p>
      ${ageHtml}
    </div>
    <div class="profile-info">
      ${bio ? `<div class="profile-bio"><p>${bio}</p></div>` : ""}
      ${interestsHtml}
    </div>`;

  // Store profile data for settings tab
  window.currentProfileData = profileData;
}

function attachTabListeners() {
  const tabs = document.querySelectorAll('[data-tab]');
  const contentElement = document.getElementById("profile-content");

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = tab.getAttribute('data-tab');

      if (tabName === 'settings') {
        renderSettingsTab(contentElement);
      } else if (tabName === 'photos') {
        contentElement.innerHTML = `
          <div style="max-width: 400px;">
            <h2 style="margin-top: 0;">Myndir</h2>
            <p>Myndarstjórnun kemur seinna</p>
          </div>
        `;
      } else if (tabName === 'friends') {
        contentElement.innerHTML = `
          <div style="max-width: 400px;">
            <h2 style="margin-top: 0;">Tengslabönd</h2>
            <p>Vinnustjórnun tengsla kemur seinna</p>
          </div>
        `;
      } else if (tabName === 'profile') {
        const profileData = window.currentProfileData;
        const currentUser = { email: 'user@example.com' };
        renderProfile(contentElement, profileData, currentUser);
      }
    });
  });
}

function renderSettingsTab(container) {
  container.innerHTML = `
    <div style="max-width: 400px;">
      <h2 style="margin-top: 0;">Stillingar</h2>
      <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 20px;">
        <h3 style="color: #e5518b; font-size: 14px; font-weight: 600; margin-bottom: 12px; margin-top: 0;">Aðgangastjórnun</h3>
        <button class="delete-account-btn" type="button" data-action="delete-account">
          Eyða aðgangi
        </button>
        <small class="delete-account-warning">
          Allt gögn þín verða eytt og ekki mögulegt að endurheimta
        </small>
      </div>
    </div>`;

  attachSettingsListeners();
}

function attachSettingsListeners() {
  const deleteBtn = document.querySelector('[data-action="delete-account"]');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', handleDeleteAccount);
  }
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
