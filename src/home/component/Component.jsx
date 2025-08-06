import React, { useState } from "react";
import {
  Container,
  Card,
  Typography,
  Grid,
  Box,
  Avatar,
  CircularProgress,
  Button,
  TextField,
  Paper,
  Chip,
} from "@mui/material";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';


const MUIScripts = () => (
  <>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  </>
);

export default function FlightSearch() {

  const [departureId, setDepartureId] = useState("LAX"); 
  const [arrivalId, setArrivalId] = useState("JFK"); 
  const [outboundDate, setOutboundDate] = useState("2025-08-07");
  const [returnDate, setReturnDate] = useState("2025-08-12");


  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false); 
  
  const RAPIDAPI_KEY = "bae420be99mshe4649e068387f0ap15f1b6jsnc1dbe11a95a0";
  const RAPIDAPI_HOST = "google-flights2.p.rapidapi.com";

  
  const fetchFlights = async () => {
    
    if (!departureId || !arrivalId || !outboundDate) {
      setError("Por favor completa los campos: Origen, Destino y Fecha de salida.");
      setHasSearched(true); 
      return;
    }

    setLoading(true); 
    setError(""); 
    setFlights([]);
    setHasSearched(false); 

   
    const url = `https://${RAPIDAPI_HOST}/api/v1/searchFlights?departure_id=${departureId}&arrival_id=${arrivalId}&outbound_date=${outboundDate}&return_date=${returnDate}&travel_class=ECONOMY&adults=1&show_hidden=1&currency=USD&language_code=en-US&country_code=US&search_type=best`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      });

      
      if (!res.ok) {
        const errorText = await res.text(); 
        throw new Error(`Error de red: ${res.status} ${res.statusText} - ${errorText}`);
      }

      const json = await res.json();
      console.log("Respuesta de la API:", json); 

      
      const results = json?.data?.itineraries?.topFlights;

      if (json.status && results?.length > 0) {
        setFlights(results); 
      } else {
        setError("No se encontraron vuelos para los parámetros indicados. Intenta con otras fechas o destinos.");
      }
    } catch (err) {
      console.error("Error al obtener los vuelos:", err); 
      setError("Ocurrió un error al buscar vuelos. Por favor, revisa tu conexión a internet o la clave API. Detalles: " + err.message);
    } finally {
      setLoading(false); 
      setHasSearched(true); 
    }
  };

  return (
    <>
      <MUIScripts /> 
      <Box 
        sx={{ 
          minHeight: '100vh', 
          py: 6, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, #e0f2f7 0%, #bbdefb 100%)', 
          fontFamily: 'Roboto, sans-serif' 
        }}
      >
        <Container maxWidth="md">
          <Card 
            raised 
            sx={{ 
              p: { xs: 2, sm: 4 }, 
              borderRadius: 4, 
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              bgcolor: 'white',
              backdropFilter: 'blur(5px)', 
              border: '1px solid rgba(255,255,255,0.3)' 
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              fontWeight="bold"
              sx={{ mb: 4, color: "#1976d2", textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }} 
            >
              Buscador de Vuelos
            </Typography>

            <Paper elevation={0} sx={{ p: { xs: 1, sm: 3 }, mb: 5, borderRadius: 3, bgcolor: '#f5f5f5' }}> 
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Origen (Código IATA)"
                    value={departureId}
                    onChange={(e) => setDepartureId(e.target.value.toUpperCase())}
                    fullWidth
                    placeholder="Ej: LAX"
                    autoComplete="off"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined" 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Destino (Código IATA)"
                    value={arrivalId}
                    onChange={(e) => setArrivalId(e.target.value.toUpperCase())}
                    fullWidth
                    placeholder="Ej: JFK"
                    autoComplete="off"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Fecha de Salida"
                    type="date"
                    value={outboundDate}
                    onChange={(e) => setOutboundDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Fecha de Regreso (opcional)"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} textAlign="center">
                  <Button
                    variant="contained"
                    onClick={fetchFlights}
                    disabled={loading}
                    size="large"
                    sx={{
                      px: 5,
                      py: 1.8,
                      fontWeight: "bold",
                      borderRadius: 3,
                      boxShadow: "0 8px 20px rgba(25,118,210,0.4)", 
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      ":hover": {
                        transform: "scale(1.03)",
                        boxShadow: "0 12px 25px rgba(25,118,210,0.6)",
                        background: 'linear-gradient(45deg, #1976D2 30%, #19A0D2 90%)', 
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={26} color="inherit" /> : "Buscar Vuelos"}
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {error && (
              <Paper elevation={1} sx={{ mt: 3, p: 2, bgcolor: '#ffebee', color: '#b71c1c', borderRadius: 2 }}>
                <Typography variant="body1" align="center" sx={{ fontWeight: "medium" }}>
                  {error}
                </Typography>
              </Paper>
            )}

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress size={60} thickness={5} sx={{ color: '#1976d2' }} />
              </Box>
            )}

            
            {!loading && !error && flights.length === 0 && hasSearched && (
              <Paper elevation={1} sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', color: '#1565c0', borderRadius: 2 }}>
                <Typography variant="body1" align="center">
                  No se encontraron vuelos para la búsqueda.
                </Typography>
              </Paper>
            )}

            {flights.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Resultados de Vuelo
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                  {flights.map((flight, i) => (
                    <Grid item xs={12} key={i} sx={{ display: "flex", flexDirection: "column" }}>
                      <Card
                        variant="elevation"
                        sx={{
                          display: "flex",
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          p: 3,
                          borderRadius: 3,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          ":hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.66)",
                          },
                          flexGrow: 1,
                          minHeight: 120,
                          
                          bgcolor: '#ffffff'
                        }}
                      >
                       
                        <Avatar
                          src={flight.airline_logo || "https://placehold.co/56x56/E0E0E0/888888?text=Logo"} 
                          alt={flight.flights?.[0]?.airline || "Aerolínea"}
                          sx={{ width: 64, height: 64, mr: { xs: 0, sm: 3 }, mb: { xs: 2, sm: 0 }, borderRadius: 2, flexShrink: 0 }}
                          variant="rounded"
                        />
                        
                       
                        <Box sx={{ flexGrow: 1, pr: { xs: 0, sm: 2 } }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: '#333' }}>
                            {flight.flights?.[0]?.airline || "Aerolínea desconocida"}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                            <FlightTakeoffIcon sx={{ verticalAlign: 'middle', fontSize: '1.1rem', mr: 0.5, color: 'text.secondary' }} />
                            <strong> {flight.departure_time} </strong> desde <strong> {flight.flights?.[0]?.departure_airport?.airport_name || "N/D"}</strong>
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            <FlightLandIcon sx={{ verticalAlign: 'middle', fontSize: '1.1rem', mr: 0.5, color: 'text.secondary' }} />
                           <strong> {flight.arrival_time} </strong> a <strong>{flight.flights?.[0]?.arrival_airport?.airport_name || "N/D"} </strong>
                          </Typography>
                          <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon sx={{ mr: 0.5, fontSize: '1rem' }} /> Duración: {flight.duration.text}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" component="div" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <ConnectingAirportsIcon sx={{ mr: 0.5, fontSize: '1rem' }} /> Escalas: 
                                <Chip label={flight.stops} size="small" sx={{ ml: 0.5 }} />
                              </Typography>

                            </Grid>
                          </Grid>
                        </Box>

                     
                        <Box sx={{ minWidth: { xs: '100%', sm: 150 }, textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 2, sm: 0 } }}>
                          <Typography variant="h5" color="primary" fontWeight="bold">
                            <AttachMoneyIcon sx={{ verticalAlign: 'middle', fontSize: '1.5rem' }} />{flight.price}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            por pasajero
                          </Typography>
                          <Button
                            variant="contained"
                            color="secondary"
                            href={flight.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 'bold',
                              bgcolor: '#ff9800', 
                              '&:hover': {
                                bgcolor: '#f57c00',
                              },
                            }}
                          >
                            Ver Oferta
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Card>
        </Container>
      </Box>
    </>
  );
}
