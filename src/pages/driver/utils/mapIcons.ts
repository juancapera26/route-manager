export const createCarIcon = (): google.maps.Icon => ({
  url:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="#1976d2" stroke="white" stroke-width="2"/>
        <path d="M12 23h1.5v1.5a1.5 1.5 0 003 0V23h3v1.5a1.5 1.5 0 003 0V23H24a1 1 0 001-1v-4l-1.5-4.5a1.5 1.5 0 00-1.5-1.2h-9a1.5 1.5 0 00-1.5 1.2L10 18v4a1 1 0 001 1zm1-6l1-3h8l1 3h-10z" fill="white"/>
      </svg>
    `),
  scaledSize:
    typeof google !== "undefined" && google.maps?.Size
      ? new google.maps.Size(36, 36)
      : (undefined as unknown as google.maps.Size),
  anchor:
    typeof google !== "undefined" && google.maps?.Point
      ? new google.maps.Point(18, 18)
      : (undefined as unknown as google.maps.Point),
});

export const createPaqueteIcon = (): google.maps.Icon => ({
  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  scaledSize:
    typeof google !== "undefined" && google.maps?.Size
      ? new google.maps.Size(36, 36)
      : (undefined as unknown as google.maps.Size),
});
