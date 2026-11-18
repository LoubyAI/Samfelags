/**
 * User Profile Management Module
 * Handles first-time profile setup (Skref 1) with form design
 */

window.firebaseProfile = {
  renderProfileSetup() {
    return `
    <div class="profile-setup-container" style="max-width: 700px; margin: 0 auto; padding: 20px;">
      <!-- Logo Section -->
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 0 0 8px 0; font-size: 32px; font-weight: 600; font-family: 'Poppins', Arial, sans-serif;">
          <span>New Friends</span>
          <img src="img/figma/7a078870-1969-4ab2-adbd-8107c25f9c4e.svg" alt="New Friends" style="width: 32px; height: 32px;">
        </h1>
        <p style="color: #e5518b; font-size: 14px; font-weight: 500; margin: 0; letter-spacing: 0.5px;">Connect · Meet · Build Friendships</p>
      </div>

      <!-- Step Indicator -->
      <div style="text-align: center; color: #e5518b; font-size: 11px; margin-bottom: 35px; font-weight: 700; letter-spacing: 1px;">
        SKREF 1 AF 2 — PERSÓNUUPPLÝSINGAR
      </div>

      <!-- Form -->
      <form class="profile-setup-form" data-form="profile-setup">
        <!-- Personal Information Section -->
        <div style="margin-bottom: 30px;">
          <div style="font-size: 15px; font-weight: 600; color: #e5518b; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #f5f5f5;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e5518b" stroke-width="2" style="display: inline-block; margin-right: 8px; vertical-align: middle;">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Persónuupplýsingar
          </div>

          <!-- Full Name -->
          <div style="margin-bottom: 16px;">
            <label for="displayName" style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 6px;">Fullt nafn *</label>
            <input 
              type="text" 
              id="displayName" 
              name="displayName"
              placeholder="Dæmi: Rósa M. Einarsdóttir"
              required
              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; box-sizing: border-box;"
            >
            <small style="display: block; color: #999; font-size: 10px; margin-top: 4px;">Þitt alvöru nafn í opinberum skrám (Birtist einungis samþykktu vinum og áhugamálahópum þínum). Millinöfn má skammstafa í einn staf með punkti.</small>
          </div>

          <!-- Nickname -->
          <div style="margin-bottom: 16px;">
            <label for="nickname" style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 6px;">Gælunafn (valfrjálst)</label>
            <input 
              type="text" 
              id="nickname" 
              name="nickname"
              placeholder="Dæmi: Rósa"
              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; box-sizing: border-box;"
            >
            <small style="display: block; color: #999; font-size: 10px; margin-top: 4px;">Birtist almenningi á þinni prófílsíðu.</small>
          </div>

          <!-- Birthday -->
          <div style="margin-bottom: 16px;">
            <label for="birthday" style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 6px;">Fæðingardagur *</label>
            <input 
              type="text" 
              id="birthday" 
              name="birthday"
              placeholder="DD.MM.YYYY"
              required
              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; box-sizing: border-box;"
            >
            <small style="display: block; color: #999; font-size: 10px; margin-top: 4px;">Þinn afmælisdagur (Birtist einungis samþykktu vinum og áhugamálahópum þínum).</small>
          </div>

          <!-- City -->
          <div style="margin-bottom: 16px;">
            <label for="city" style="display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 6px;">Borg / Sveitarfélag</label>
            <select 
              id="city" 
              name="city"
              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; box-sizing: border-box;"
            >
              <option value="">-- Veldu borg/sveitarfélag --</option>
              <option value="Reykjavík">Reykjavík</option>
              <option value="Akureyri">Akureyri</option>
              <option value="Hafnarfjörður">Hafnarfjörður</option>
              <option value="Kópavogur">Kópavogur</option>
              <option value="Mosfellsbær">Mosfellsbær</option>
              <option value="Garðabær">Garðabær</option>
              <option value="Hveragerði">Hveragerði</option>
              <option value="Borgarnes">Borgarnes</option>
              <option value="Selfoss">Selfoss</option>
              <option value="Hvolsvöllur">Hvolsvöllur</option>
              <option value="Vík">Vík</option>
              <option value="Ísafjörður">Ísafjörður</option>
              <option value="Stykkishólmur">Stykkishólmur</option>
              <option value="Akranes">Akranes</option>
            </select>
            <small style="display: block; color: #999; font-size: 10px; margin-top: 4px;">Hjálpar okkur að tengja þig við fólk nálægt þér.</small>
          </div>
        </div>

        <div class="button-group" style="display: flex; gap: 12px; margin-top: 30px;">
          <button type="button" class="button button-secondary" onclick="skipProfileSetup()" style="flex: 1; padding: 12px 24px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; background: #f0f0f0; color: #333;">
            Sleppa þessu skrefi
          </button>
          <button type="submit" class="button button-primary" onclick="submitProfileSetup(event)" style="flex: 1; padding: 12px 24px; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; background: #e5518b; color: white;">
            Halda áfram →
          </button>
        </div>
      </form>
    </div>
    `;
  }
};

function submitProfileSetup(event) {
  event.preventDefault();
  
  const displayName = document.getElementById('displayName')?.value?.trim() || '';
  const nickname = document.getElementById('nickname')?.value?.trim() || '';
  const birthday = document.getElementById('birthday')?.value?.trim() || '';
  const city = document.getElementById('city')?.value || '';

  if (displayName) {
    const nameParts = displayName.split(/\s+/);
    const validNameParts = nameParts.filter(word => 
      word.length >= 2 || 
      /^[a-záéíóúýþæö]\.$/i.test(word)
    );
    if (validNameParts.length < 2) {
      alert('⚠️ Vinsamlegast sláðu inn fullt nafn');
      return;
    }
  }

  if (birthday) {
    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = birthday.match(dateRegex);
    if (match) {
      const day = parseInt(match[1]);
      const month = parseInt(match[2]);
      const year = parseInt(match[3]);
      
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 15) {
        alert('⚠️ Vertu að minnsta kosti 15 ára gömul/ur til að stofna reikning');
        return;
      }
    } else {
      alert('⚠️ Vinsamlegast sláðu inn birthdaginn á forminu DD.MM.YYYY');
      return;
    }
  }

  localStorage.setItem('profileData', JSON.stringify({
    displayName: displayName,
    nickname: nickname,
    birthday: birthday,
    city: city
  }));

  window.location.href = 'app.html?view=photo-policy';
}

function skipProfileSetup() {
  if (confirm('Ertu viss um að þú viljir sleppa þessu skrefi?')) {
    window.location.href = 'app.html?view=photo-policy';
  }
}
