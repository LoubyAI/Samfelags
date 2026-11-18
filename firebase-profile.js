/**
 * User Profile Management Module
 * Handles first-time profile setup, profile updates, and age-based group filtering
 */

const AGE_GROUPS = [
  { label: "18-25 ára", min: 18, max: 25 },
  { label: "26-35 ára", min: 26, max: 35 },
  { label: "36-50 ára", min: 36, max: 50 },
  { label: "50+ ára", min: 50, max: 150 },
];

window.firebaseProfile = {
  /**
   * Renders the first-time profile setup form
   * @returns {string} HTML for profile setup
   */
  renderProfileSetup() {
    return `
      <div class="profile-setup-container">
        <div class="profile-setup-card">
          <p style="text-align: center; color: #e5518b; font-size: 12px; font-weight: 600; margin-bottom: 20px;">Skref 1 af 2 | Prófíl</p>
          <h1>Halló! Við myndum vilja kynnast þér betur</h1>
          <p class="subtitle">Fylltu út þina prófílupplýsingar til að komast í samband við nýja vini</p>
          
          <form class="profile-setup-form" data-form="profile-setup">
            <!-- Private Photo Upload (for friends & groups) -->
            <div class="form-group">
              <label for="profile-photo-private">Mynd af þér (fyrir vini og hópa)</label>
              <div class="photo-upload-area">
                <input 
                  id="profile-photo-private" 
                  name="photoPrivate" 
                  type="file" 
                  accept="image/*" 
                  required
                  aria-label="Veldu alvöru mynd af þér fyrir vini og hópa"
                >
                <div class="photo-placeholder" id="photo-preview-private">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  <span>Smelltu til að bæta við mynd</span>
                </div>
              </div>
              <small>Alvöru mynd af þér. JPG, PNG eða GIF (hámark 5MB)</small>
            </div>

            <!-- Public Photo Upload (for strangers) -->
            <div class="form-group">
              <label for="profile-photo-public">Mynd fyrir almenning (valfrjálst)</label>
              <div class="photo-upload-area">
                <input 
                  id="profile-photo-public" 
                  name="photoPublic" 
                  type="file" 
                  accept="image/*"
                  aria-label="Veldu mynd fyrir almenning"
                >
                <div class="photo-placeholder" id="photo-preview-public">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  <span>Smelltu til að bæta við mynd</span>
                </div>
              </div>
              <small>Þessi mynd birtist fyrir óþekkta einstaklinga. JPG, PNG eða GIF (hámark 5MB)</small>
            </div>

            <!-- Full Name -->
            <div class="form-group">
              <label for="profile-name">Fullt nafn</label>
              <input 
                id="profile-name" 
                name="displayName" 
                type="text" 
                placeholder="Skrifaðu fullt nafnið þitt" 
                required
                autocomplete="name"
              >
              <small>Þetta verður ekki hægt að breyta eftir skráningu</small>
            </div>

            <!-- Nickname (Optional) -->
            <div class="form-group">
              <label for="profile-nickname">Gælunafn (valfrjálst)</label>
              <input 
                id="profile-nickname" 
                name="nickname" 
                type="text" 
                placeholder="Skrifaðu gælunafn ef þú vilt"
                autocomplete="off"
              >
              <small>Þetta mun birtast á þinni prófílsíðu. Fullt nafn virðist aðeins vinum þínum og hópum.</small>
            </div>

            <!-- Birthday -->
            <div class="form-group">
              <label for="profile-birthday">Fæðingardagur</label>
              <input 
                id="profile-birthday" 
                name="birthday" 
                type="date" 
                required
                autocomplete="off"
              >
              <small>Þetta verður notað til að tengja þig við viðeigandi hópa og viðburði</small>
            </div>

            <!-- City -->
            <div class="form-group">
              <label for="profile-city">Borg/Svæði</label>
              <select id="profile-city" name="city" required>
                <option value="">-- Veldu borg --</option>
                <option value="reykjavik">Reykjavík</option>
                <option value="hafnarfjordur">Hafnarfjörður</option>
                <option value="kópavogur">Kópavogur</option>
                <option value="mosfellsbær">Mosfellsbær</option>
                <option value="garðabær">Garðabær</option>
                <option value="akranes">Akranes</option>
                <option value="borgarnes">Borgarnes</option>
                <option value="hveragerdi">Hveragerði</option>
                <option value="selfoss">Selfoss</option>
                <option value="akureyri">Akureyri</option>
                <option value="isafjordur">Ísafjörður</option>
                <option value="hofn">Höfn</option>
                <option value="other">Annað</option>
              </select>
            </div>


            <!-- Bio (Optional) -->
            <div class="form-group">
              <label for="profile-bio">Um þig (valfrjálst)</label>
              <textarea 
                id="profile-bio" 
                name="bio" 
                placeholder="Segðu okkur eitthvað um þig... Hvað hefur þú gaman af?"
                rows="4"
                maxlength="500"
              ></textarea>
              <small><span id="bio-count">0</span>/500 stafir</small>
            </div>

            <!-- Interests (Optional) -->
            <div class="form-group">
              <label>Þíir áhugamál (valfrjálst)</label>
              <div class="interests-grid" id="interests-grid">
                <label class="interest-checkbox">
                  <input type="checkbox" name="interests" value="sports">
                  <span>⚽ Íþróttir</span>
                </label>
                <label class="interest-checkbox">
                  <input type="checkbox" name="interests" value="travel">
                  <span>✈️ Ferðalög</span>
                </label>
                <label class="interest-checkbox">
                  <input type="checkbox" name="interests" value="food">
                  <span>🍴 Matur</span>
                </label>
                <label class="interest-checkbox">
                  <input type="checkbox" name="interests" value="movies">
                  <span>🎬 Kvikmyndir</span>
                </label>
                <label class="interest-checkbox">
                  <input type="checkbox" name="interests" value="music">
                  <span>🎵 Tónlist</span>
                </label>
                <label class="interest-checkbox">
                  <input type="checkbox" name="interests" value="art">
                  <span>🎨 Listaverk</span>
                </label>
                <label class="interest-checkbox">
                  <input type="checkbox" name="interests" value="books">
                  <span>📚 Bækur</span>
                </label>
                <label class="interest-checkbox">
                  <input type="checkbox" name="interests" value="games">
                  <span>🎮 Leikir</span>
                </label>
              </div>
              <small>Valfrjálst en það hjálpar okkur að tengja þig við viðeigandi vini</small>
            </div>

            <!-- Error Message -->
            <div id="profile-setup-error" class="error-message" hidden></div>

            <!-- Submit Button -->
            <div style="display: flex; gap: 12px; margin-top: 20px;">
              <button type="button" class="button button-secondary" onclick="skipToHome()" style="flex: 1; padding: 12px 24px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; background: #f0f0f0; color: #333;">
                Sleppa þessu skrefi
              </button>
              <button type="submit" class="button button-primary button-large" style="flex: 1;">
                Halda áfram →
              </button>
            </div>

            <p class="form-note">
              Þú getur alltaf breytt þessum upplýsingum síðar í stillingum
            </p>
          </form>
        </div>
      </div>
    `;
  },

  /**
   * Render profile settings page (editable profile)
   * @param {Object} profile - Current user profile
   * @returns {string} HTML for settings
   */
  renderProfileSettings(profile = {}) {
    return `
      <div class="profile-settings-container">
        <div class="settings-card">
          <h2>Prófílstillingar</h2>
          
          <form class="profile-edit-form" data-form="profile-edit">
            <!-- Private Photo (for friends & groups) -->
            <div class="form-group">
              <label for="edit-photo-private">Mynd fyrir vini og hópa</label>
              <div class="photo-preview-container">
                ${profile.photoPrivateUrl ? `<img src="${profile.photoPrivateUrl}" alt="Prófílmynd fyrir vini" class="current-photo">` : ''}
                <input 
                  id="edit-photo-private" 
                  name="photoPrivate" 
                  type="file" 
                  accept="image/*"
                  aria-label="Breyta mynd fyrir vini og hópa"
                >
              </div>
              <small>Alvöru mynd sem vinir þínir og hópar sjá</small>
            </div>

            <!-- Public Photo (for strangers) -->
            <div class="form-group">
              <label for="edit-photo-public">Mynd fyrir almenning</label>
              <div class="photo-preview-container">
                ${profile.photoPublicUrl ? `<img src="${profile.photoPublicUrl}" alt="Almenn prófílmynd" class="current-photo">` : ''}
                <input 
                  id="edit-photo-public" 
                  name="photoPublic" 
                  type="file" 
                  accept="image/*"
                  aria-label="Breyta mynd fyrir almenning"
                >
              </div>
              <small>Þessi mynd birtist fyrir óþekkta einstaklinga</small>
            </div>

            <!-- Full Name (Read-only) -->
            <div class="form-group">
              <label for="edit-name">Fullt nafn</label>
              <input 
                id="edit-name" 
                name="displayName" 
                type="text" 
                value="${profile.displayName || ''}" 
                required
                readonly
                aria-label="Fullt nafn (ekki hægt að breyta)"
              >
              <small style="color: #666;">🔒 Fullt nafn verður ekki hægt að breyta eftir skráningu til að ganga úr skugga um auðkenni</small>
            </div>

            <!-- Nickname (Editable) -->
            <div class="form-group">
              <label for="edit-nickname">Gælunafn</label>
              <input 
                id="edit-nickname" 
                name="nickname" 
                type="text" 
                value="${profile.nickname || ''}" 
                placeholder="Hægt er að breyta þessu"
              >
              <small>Þetta mun birtast almenningi á þinni prófílsíðu</small>
              <div class="visibility-info" style="margin-top: 10px; padding: 10px; background: #f0f8ff; border-radius: 6px; border-left: 4px solid #0084ff;">
                <strong>👁️ Sýnileiki:</strong><br/>
                📢 <strong>Öll:</strong> Gælunafn<br/>
                👥 <strong>Vinir:</strong> ${profile.displayName || 'Fullt nafn'} + Gælunafn<br/>
                📅 <strong>Hópar/Viðburðir:</strong> Fullt nafn (til skipulagningar)
              </div>
            </div>

            <!-- Birthday (Read-only) -->
            <div class="form-group">
              <label for="edit-birthday">Fæðingardagur</label>
              <input 
                id="edit-birthday" 
                name="birthday" 
                type="date" 
                value="${profile.birthday || ''}" 
                required
                readonly
                aria-label="Fæðingardagur (ekki hægt að breyta)"
              >
              <small style="color: #666;">🔒 Fæðingardagur verður ekki hægt að breyta eftir skráningu</small>
              <div class="age-info" id="age-info" style="margin-top: 10px; padding: 10px; background: #e8f4f8; border-radius: 6px;">
                ${profile.birthday ? `
                  Núverandi aldur: <strong>${this.calculateAgeFromBirthday(profile.birthday)}</strong> ára<br/>
                  Aldurshópur (læstur): <strong style="color: #e5518b;">${profile.ageGroup || 'Ekki skilgreindur'}</strong>
                ` : ''}
              </div>
            </div>

            <!-- City -->
            <div class="form-group">
              <label for="edit-city">Borg/Svæði</label>
              <select id="edit-city" name="city" required>
                <option value="reykjavik" ${profile.city === 'reykjavik' ? 'selected' : ''}>Reykjavík</option>
                <option value="hafnarfjordur" ${profile.city === 'hafnarfjordur' ? 'selected' : ''}>Hafnarfjörður</option>
                <option value="kópavogur" ${profile.city === 'kópavogur' ? 'selected' : ''}>Kópavogur</option>
                <option value="mosfellsbær" ${profile.city === 'mosfellsbær' ? 'selected' : ''}>Mosfellsbær</option>
                <option value="garðabær" ${profile.city === 'garðabær' ? 'selected' : ''}>Garðabær</option>
                <option value="akranes" ${profile.city === 'akranes' ? 'selected' : ''}>Akranes</option>
                <option value="borgarnes" ${profile.city === 'borgarnes' ? 'selected' : ''}>Borgarnes</option>
                <option value="hveragerdi" ${profile.city === 'hveragerdi' ? 'selected' : ''}>Hveragerði</option>
                <option value="selfoss" ${profile.city === 'selfoss' ? 'selected' : ''}>Selfoss</option>
                <option value="akureyri" ${profile.city === 'akureyri' ? 'selected' : ''}>Akureyri</option>
                <option value="isafjordur" ${profile.city === 'isafjordur' ? 'selected' : ''}>Ísafjörður</option>
                <option value="hofn" ${profile.city === 'hofn' ? 'selected' : ''}>Höfn</option>
                <option value="other" ${profile.city === 'other' ? 'selected' : ''}>Annað</option>
              </select>
            </div>

            <!-- Bio -->
            <div class="form-group">
              <label for="edit-bio">Um þig</label>
              <textarea 
                id="edit-bio" 
                name="bio" 
                rows="4" 
                maxlength="500"
              >${profile.bio || ''}</textarea>
              <small><span id="edit-bio-count">${(profile.bio || '').length}</span>/500 stafir</small>
            </div>

            <!-- Interests -->
            <div class="form-group">
              <label>Áhugamál</label>
              <div class="interests-grid">
                ${['sports', 'travel', 'food', 'movies', 'music', 'art', 'books', 'games'].map(interest => `
                  <label class="interest-checkbox">
                    <input 
                      type="checkbox" 
                      name="interests" 
                      value="${interest}"
                      ${(profile.interests || []).includes(interest) ? 'checked' : ''}
                    >
                    <span>${this.getInterestEmoji(interest)} ${this.getInterestLabel(interest)}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <div id="profile-edit-error" class="error-message" hidden></div>

            <div class="form-actions">
              <button type="submit" class="button button-primary">Vista breytingar</button>
              <button type="button" class="button button-secondary" data-action="cancel-edit">Hætta við</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  getInterestEmoji(interest) {
    const emojis = {
      sports: '⚽',
      travel: '✈️',
      food: '🍴',
      movies: '🎬',
      music: '🎵',
      art: '🎨',
      books: '📚',
      games: '🎮',
    };
    return emojis[interest] || '';
  },

  getInterestLabel(interest) {
    const labels = {
      sports: 'Íþróttir',
      travel: 'Ferðalög',
      food: 'Matur',
      movies: 'Kvikmyndir',
      music: 'Tónlist',
      art: 'Listaverk',
      books: 'Bækur',
      games: 'Leikir',
    };
    return labels[interest] || interest;
  },

  /**
   * Get display name for age group
   */
  getAgeGroupLabel(age) {
    for (const group of AGE_GROUPS) {
      if (age >= group.min && age <= group.max) {
        return group.label;
      }
    }
    return 'Unknown';
  },

  /**
   * Calculate age from birthdate string (YYYY-MM-DD format)
   */
  calculateAgeFromBirthday(birthdayString) {
    if (!birthdayString) return null;
    
    const birthDate = new Date(birthdayString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },

  /**
   * Calculate age from birthdate object
   */
  calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },

  /**
   * Render community policy modal
   * @returns {string} HTML for policy modal
   */
  renderCommunityPolicyModal() {
    return `
      <div class="modal-overlay" id="policy-modal" data-modal="policy">
        <div class="modal-content policy-modal">
          <div class="modal-header">
            <h2>📋 Reglur New Friends</h2>
          </div>
          <div class="modal-body">
            <p class="modal-intro"><strong>Við treystum á þér að vera heiðarleg/ur 💙</strong></p>
            
            <div class="policy-section">
              <h3>✅ Samkomulag um notkun á prófílum</h3>
              <p>Með því að ganga til liðs við <strong>New Friends</strong> samþykkir þú að:</p>
              
              <div class="policy-item">
                <strong>Nota alvöru skráð nafn.</strong>
                <p>Nafnið sem birtist á prófílsíðu þinni fyrir samþykkta vini og áhugamálahópa verður að vera þitt alvöru nafn sem skráð er í opinberum skrám (t.d. þjóðskrá).</p>
              </div>
              
              <div class="policy-item">
                <strong>Nota rétta fæðingardag.</strong>
                <p>Aldur þinn verður að vera nákvæmur (ekki hægt að breyta þessu eftir skráningu).</p>
              </div>
              
              <div class="policy-item">
                <strong>Prófílmynd fyrir vini og hópa verður að vera alvöru mynd af þér.</strong>
                <p>Núverandi alvöru mynd af þér er nauðsynleg svo fólk viti hver þú ert. Engar listaverk, afmælisupptökur eða gömlar myndir.</p>
              </div>
            </div>

            <div class="policy-section">
              <h3>🚨 Afleiðingar brota</h3>
              <p>Ef <strong>alvöru nafnið þitt fylgir ekki þessum reglum</strong>, verður prófílinn þinn <strong>eytt</strong>.</p>
              
              <ul class="policy-list">
                <li>Vinir og hópstjórar geta tilkynnt fölsk prófíl.</li>
                <li>Tilkynntar prófílir eru skoðuð af umsjónum og New Friends teyminu.</li>
                <li>Fals nöfn leiða til tafarlauss þurrkun aðgangs af New Friends teyminu.</li>
              </ul>
            </div>

            <div class="policy-section">
              <h3>❓ Spurningar?</h3>
              <p>Lestu fullar reglur okkar til að kynnast flóknari málum um persónuvernd og samfélag.</p>
            </div>
          </div>
          
          <div class="modal-footer">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                id="policy-agree" 
                name="policy-agree"
                required
              >
              <span>Ég samþykki reglur New Friends og skuldbind mig til að nota alvöru gögn.</span>
            </label>
            <div class="modal-actions">
              <button 
                type="button" 
                class="button button-secondary" 
                data-action="decline-policy"
              >
                Hafna
              </button>
              <button 
                type="button" 
                class="button button-primary" 
                data-action="accept-policy"
                disabled
              >
                Samþykkja og halda áfram
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render public profile view (what strangers see)
   * @param {Object} profile - User profile data
   * @returns {string} HTML for public profile
   */
  renderPublicProfile(profile = {}) {
    return `
      <div class="profile-view-container public-profile">
        <div class="profile-view-card">
          <div class="profile-header">
            ${profile.photoPublicUrl ? `
              <img src="${profile.photoPublicUrl}" alt="${profile.nickname || 'Prófílmynd'}" class="profile-photo">
            ` : `
              <div class="profile-photo-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M12 14c-5.5 0-8 2.5-8 5v3h16v-3c0-2.5-2.5-5-8-5z"></path>
                </svg>
              </div>
            `}
            <h2>${profile.nickname || 'Notandi'}</h2>
            <p class="profile-age">🎂 ${profile.currentAge || '?'} ára</p>
          </div>

          <div class="profile-info">
            ${profile.city ? `<p>📍 ${profile.city}</p>` : ''}
            ${profile.interests && profile.interests.length > 0 ? `
              <div class="profile-interests">
                <strong>Áhugamál:</strong>
                <div class="interests-list">
                  ${profile.interests.map(interest => `
                    <span class="interest-tag">${this.getInterestEmoji(interest)} ${this.getInterestLabel(interest)}</span>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="profile-actions">
            <button class="button button-primary" data-action="send-friend-request">
              Senda vináboð
            </button>
            <button class="button button-secondary" data-action="report-profile">
              ⚠️ Tilkynna
            </button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render private profile view (what friends/groups see)
   * @param {Object} profile - User profile data
   * @returns {string} HTML for private profile
   */
  renderPrivateProfile(profile = {}) {
    return `
      <div class="profile-view-container private-profile">
        <div class="profile-view-card">
          <div class="profile-header">
            ${profile.photoPrivateUrl ? `
              <img src="${profile.photoPrivateUrl}" alt="${profile.displayName}" class="profile-photo">
            ` : `
              <div class="profile-photo-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M12 14c-5.5 0-8 2.5-8 5v3h16v-3c0-2.5-2.5-5-8-5z"></path>
                </svg>
              </div>
            `}
            <h2>${profile.displayName}</h2>
            ${profile.nickname ? `<p class="nickname">(${profile.nickname})</p>` : ''}
            <p class="profile-age">🎂 ${profile.currentAge || '?'} ára · ${profile.ageGroup || 'Aldurshópur'}</p>
          </div>

          <div class="profile-info">
            ${profile.city ? `<p>📍 ${profile.city}</p>` : ''}
            
            ${profile.bio ? `
              <div class="profile-bio">
                <strong>Um mig:</strong>
                <p>${profile.bio}</p>
              </div>
            ` : ''}

            ${profile.interests && profile.interests.length > 0 ? `
              <div class="profile-interests">
                <strong>Áhugamál:</strong>
                <div class="interests-list">
                  ${profile.interests.map(interest => `
                    <span class="interest-tag">${this.getInterestEmoji(interest)} ${this.getInterestLabel(interest)}</span>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="profile-actions">
            <button class="button button-primary" data-action="message-friend">
              💬 Senda skilaboð
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
