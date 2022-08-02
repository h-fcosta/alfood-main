import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IRestaurante from "../../../interfaces/IRestaurante";

const FormularioRestaurante = () => {
  const [nomeRestaurante, setNomeRestaurante] = useState("");
  const parametros = useParams();

  useEffect(() => {
    if (parametros.id) {
      http
        .get<IRestaurante>(`restaurantes/${parametros.id}/`)
        .then((resposta) => setNomeRestaurante(resposta.data.nome));
    }
  }, [parametros]);

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (parametros.id) {
      http
        .put(`restaurantes/${parametros.id}/`, {
          nome: nomeRestaurante,
        })
        .then(() => {
          alert("Restaurante atualizado com sucesso!");
        });
    } else {
      http
        .post("restaurantes/", {
          nome: nomeRestaurante,
        })
        .then(() => {
          alert("Restaurante cadastrado com sucesso!");
        });
    }
  };

  return (
    <>
      {/* conteúdo da página */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <Typography component="h1" variant="h6">
          Formulário de Restaurantes
        </Typography>
        <Box component="form" sx={{ width: "100%" }} onSubmit={aoSubmeterForm}>
          <TextField
            value={nomeRestaurante}
            onChange={(evento) => setNomeRestaurante(evento.target.value)}
            label="Nome do Restaurante"
            variant="standard"
            fullWidth
            required
          />
          <Button
            sx={{ marginTop: 1 }}
            type="submit"
            variant="outlined"
            fullWidth
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default FormularioRestaurante;
