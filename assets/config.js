// Where codes are saved.
// Leave BACKEND_URL empty to save in each RA's browser only (they then download a CSV).
// To save centrally, deploy backend/Code.gs as a Google Apps Script web app (see README)
// and paste its /exec URL here. RAs then need the project key in their link: ...#k=YOURKEY
window.CONFIG = {
  BACKEND_URL: "",
  STALE_MINUTES: 30,   // an unfinished claim frees its article after this long
};
