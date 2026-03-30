// hero-avatar.js — CSS-drawn hero with costume layers

export function renderHero(costumes = [], size = 'medium') {
  const sizeClass = `hero-${size}`;
  const hasBoot = costumes.includes('speed_boots');
  const hasGloves = costumes.includes('speed_gloves');
  const hasBelt = costumes.includes('speed_belt');
  const hasMask = costumes.includes('speed_mask');
  const hasCape = costumes.includes('speed_cape');
  const hasCrown = costumes.includes('speed_crown');

  return `
    <div class="hero-avatar ${sizeClass}">
      ${hasCape ? '<div class="hero-cape"></div>' : ''}
      <div class="hero-head ${hasMask ? 'has-mask' : ''}">
        ${hasCrown ? '<div class="hero-crown"></div>' : ''}
        <div class="hero-eye hero-eye-l"></div>
        <div class="hero-eye hero-eye-r"></div>
      </div>
      <div class="hero-body">
        ${hasBelt ? '<div class="hero-belt"></div>' : ''}
      </div>
      <div class="hero-arms">
        <div class="hero-arm hero-arm-l ${hasGloves ? 'has-gloves' : ''}"></div>
        <div class="hero-arm hero-arm-r ${hasGloves ? 'has-gloves' : ''}"></div>
      </div>
      <div class="hero-legs">
        <div class="hero-leg hero-leg-l ${hasBoot ? 'has-boots' : ''}"></div>
        <div class="hero-leg hero-leg-r ${hasBoot ? 'has-boots' : ''}"></div>
      </div>
    </div>
  `;
}
