import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IPrato from "../../../interfaces/IPrato";
import IRestaurante from "../../../interfaces/IRestaurante";
import ITag from "../../../interfaces/ITag";

const FormularioPrato = () => {
  const parametros = useParams();

  const [nomePrato, setNomePrato] = useState("");
  const [descricao, setDescricao] = useState("");

  const [tag, setTag] = useState("");
  const [restaurante, setRestaurante] = useState(0);

  const [tags, setTags] = useState<ITag[]>([]);
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

  const [imagem, setImagem] = useState<File | null>(null);

  const selecaoArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    if (evento.target.files?.length) {
      setImagem(evento.target.files[0]);
    } else {
      setImagem(null);
    }
  };

  useEffect(() => {
    http
      .get<{ tags: ITag[] }>("tags/")
      .then((resposta) => setTags(resposta.data.tags));

    http
      .get<IRestaurante[]>("restaurantes/")
      .then((resposta) => setRestaurantes(resposta.data));
  }, []);

  useEffect(() => {
    if (parametros.id) {
      http.get<IPrato>(`pratos/${parametros.id}/`).then((resposta) => {
        setNomePrato(resposta.data.nome);
        setDescricao(resposta.data.descricao);
        setTag(resposta.data.tag);
        setRestaurante(resposta.data.restaurante);
      });
    }
  }, [parametros]);

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const formData = new FormData();

    formData.append("nome", nomePrato);
    formData.append("descricao", descricao);
    formData.append("tag", tag);
    formData.append("restaurante", restaurante.toString());

    if (imagem) {
      formData.append("imagem", imagem);
    }

    http
      .request({
        url: "pratos/",
        method: "POST",
        headers: {
          "Content-Type": "multipart/forma-data",
        },
        data: formData,
      })
      .then(() => {
        setNomePrato("");
        setDescricao("");
        setTag("");
        setRestaurante(0);
        alert("Prato cadastrado com sucesso!");
      })
      .catch((erro) => console.log(erro));
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
          Formulário de Pratos
        </Typography>
        <Box component="form" sx={{ width: "100%" }} onSubmit={aoSubmeterForm}>
          <TextField
            value={nomePrato}
            onChange={(evento) => setNomePrato(evento.target.value)}
            label="Nome do Prato"
            variant="standard"
            fullWidth
            required
            margin="dense"
          />
          <TextField
            value={descricao}
            onChange={(evento) => setDescricao(evento.target.value)}
            label="Descrição do Prato"
            variant="standard"
            fullWidth
            required
            margin="dense"
          />

          <FormControl margin="dense" variant="standard" fullWidth>
            <InputLabel id="select-tag">Tag</InputLabel>
            <Select
              labelId="select-tag"
              value={tag}
              onChange={(evento) => setTag(evento.target.value)}
            >
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.value}>
                  {tag.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl margin="dense" variant="standard" fullWidth>
            <InputLabel id="select-restaurante">Restaurante</InputLabel>
            <Select
              labelId="select-restaurante"
              value={restaurante}
              onChange={(evento) => setRestaurante(Number(evento.target.value))}
            >
              {restaurantes.map((restaurante) => (
                <MenuItem key={restaurante.id} value={restaurante.id}>
                  {restaurante.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <input type="file" onChange={selecaoArquivo} />

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

export default FormularioPrato;
