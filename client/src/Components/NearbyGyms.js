import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Spinner, Alert, Badge, Row, Col } from "reactstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const NearbyGyms = () => {
  const navigate = useNavigate();
  const email    = useSelector((state) => state.users.user.email);

  const [gyms,    setGyms]    = useState([]);
  const [coords,  setCoords]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("fittrack_user");
    if (!email && !saved) navigate("/login");
  }, [email]);

  const findGyms = () => {
    setError("");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          setCoords({ lat: latitude, lng: longitude });
          const res = await axios.get(
            `http://localhost:3001/getNearbyGyms?lat=${latitude}&lng=${longitude}`
          );
          setGyms(res.data.gyms);
        } catch (err) {
          setError("Could not fetch nearby gyms.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied. Please allow location access in your browser.");
        setLoading(false);
      }
    );
  };

  return (
    <>
      <h4 className="mb-1">Nearby Gyms</h4>
      <p className="text-muted mb-4">Find fitness centers close to you</p>

      {error && <Alert color="danger">{error}</Alert>}

      {!coords && (
        <Card className="stat-card mb-4">
          <CardBody className="text-center py-5">
            <div style={{ fontSize: "3rem" }}>📍</div>
            <h5>Find Gyms Near You</h5>
            <p className="text-muted">We'll use your current location to find nearby gyms</p>
            <Button color="primary" onClick={findGyms} disabled={loading}>
              {loading ? <><Spinner size="sm" /> Locating…</> : "📍 Use My Location"}
            </Button>
          </CardBody>
        </Card>
      )}

      {coords && (
        <>
          <Button color="outline-primary" size="sm" className="mb-3" onClick={findGyms} disabled={loading}>
            🔄 Refresh
          </Button>

          <Card className="stat-card mb-4">
            <CardBody className="p-0 overflow-hidden" style={{ borderRadius: 12 }}>
              <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: 350, width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                <Marker position={[coords.lat, coords.lng]}>
                  <Popup>📍 You are here</Popup>
                </Marker>
                {gyms.map((gym) => (
                  <Marker key={gym.id} position={[gym.location.lat, gym.location.lng]}>
                    <Popup>
                      <strong>{gym.name}</strong><br />
                      {gym.address}<br />
                      {gym.rating && `⭐ ${gym.rating}`}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </CardBody>
          </Card>

          <h5 className="mb-3">{gyms.length} nearest gym found</h5>
          <Row className="g-3">
            {gyms.map((gym) => (
              <Col md={6} key={gym.id}>
                <Card className="workout-card">
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1 fw-bold">{gym.name}</h6>
                        <small className="text-muted">📍 {gym.address}</small>
                      </div>
                      <Badge color={gym.isOpen ? "success" : "secondary"} pill>
                        {gym.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    {gym.rating && (
                      <div className="mt-2">
                        <small>⭐ {gym.rating}/5</small>
                      </div>
                    )}
                    <Button
                    tag="a"
                    href={`https://www.google.com/maps/?q=${gym.location.lat},${gym.location.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    size="sm"
                    color="outline-primary"
                    className="mt-2"
                    >
                    📍 Open in Google Maps
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default NearbyGyms;