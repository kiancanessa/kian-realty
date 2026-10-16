// Where El Casa Rosarito lives on Google Maps. Plain constants (no server-only
// code) so the page can link to it and the sync code can use the same id.

/** Derived from the listing's Maps feature id (0x80d9310ada53cfb7:0x7ee205350d32049a). */
export const GOOGLE_PLACE_ID = "ChIJt89T2gox2YARmgQyDTUF4n4";
/** The short link the business shares; opens the profile on Google Maps. */
export const GOOGLE_PROFILE_URL = "https://maps.app.goo.gl/Qp3g7CKCrx1EC82Z8";
/** Opens Google's "write a review" box for this place (asks the visitor to sign in). */
export const GOOGLE_WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;
