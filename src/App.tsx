import "./App.css";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "./components/card";

type Data = {
  count: number;
  next: string;
  previous: null | string;
  results: {
    name: string;
    url: string;
  }[];
};

type Results = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
}[];

const fetchPokemon = async () => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
  );

  const data: Data = await response.json();

  const results = [];

  //data returns a result array which has a link , so it needs to be fetched too :)
  for (const result of data.results) {
    const res = await fetch(result.url);
    const pokemonData = await res.json();
    results.push(pokemonData);
  }

  console.log("[results]", results);

  return results as Results;
};

export default function App() {
  const { data, isLoading } = useQuery({
    queryFn: fetchPokemon,
    queryKey: ["Pokemon"],
  });

  console.log("hmmmm", data);

  const DisplayPokemon = () => (
    <>
      <div className="grid grid-col-1 md:grid-cols-3 gap-5">
        {!isLoading &&
          data?.map((pokemon) => (
            <Card key={pokemon.id}>
              <CardTitle className="capitalize">{pokemon.name}</CardTitle>
              <CardDescription className="flex justify-center">
                <img
                  className="card-image"
                  src={`${pokemon.sprites["front_default"]}`}
                />
              </CardDescription>
              <CardFooter className="capitalize">
                Type:{" "}
                {pokemon.types.map((type: any) => type.type.name).join(", ")}
              </CardFooter>
            </Card>
          ))}
      </div>
    </>
  );

  return <div>{data && <DisplayPokemon />}</div>;
}
