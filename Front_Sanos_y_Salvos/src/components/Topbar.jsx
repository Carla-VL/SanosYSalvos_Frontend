function Topbar() {
  return (
    <div className="topbar-gradient text-white py-2">
      <div className="container d-flex justify-content-between flex-wrap">
        <div>
          <small className="me-3">
            <i className="bi bi-telephone-fill me-2"></i>
            +56 9 1234 5678
          </small>

          <small>
            <i className="bi bi-envelope-fill me-2"></i>
            contacto@sanosysalvos.cl
          </small>
        </div>

        <div>
          <small className="me-3">
            <i className="bi bi-facebook"></i>
          </small>
          <small className="me-3">
            <i className="bi bi-twitter-x"></i>
          </small>
          <small className="me-3">
            <i className="bi bi-instagram"></i>
          </small>
          <small>
            <i className="bi bi-globe2"></i>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Topbar;