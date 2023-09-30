import "./App.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "./components/card";
import CardSkeleton from "./components/card-skeleton";
import { useInView } from "react-intersection-observer";
import React from "react";

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

type FetchResult = { data: Data; results: Results };

const fetchPokemon = async (pageParam: number): Promise<FetchResult> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${pageParam}`
  );

  const data = await response.json();

  const results = [];

  //data returns a result array which has a link , so it needs to be fetched too :)
  for (const result of data.results) {
    const res = await fetch(result.url);
    const pokemonData = await res.json();
    results.push(pokemonData);
  }

  console.log("[results]", results);

  return { data, results };
};

export default function App() {
  const { ref, inView } = useInView();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ["Pokemon"],
      async ({ pageParam }) => {
        const res = await fetchPokemon(pageParam);
        return res;
      },
      {
        getNextPageParam: (_, page) => {
          console.log(page);
          return page.length * 20;
        },
      }
    );

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      {isLoading && <CardSkeleton />}
      <div className="grid grid-col-1 md:grid-cols-3 gap-5">
        {data?.pages.map((page) =>
          page.results.map((pokemon) => (
            <Card key={pokemon.id}>
              <CardTitle className="capitalize">{pokemon.name}</CardTitle>
              <CardDescription className="flex justify-center">
                <img
                  className="card-image"
                  src={`${pokemon.sprites["front_default"]}`}
                />
              </CardDescription>
              <CardFooter className="capitalize">
                Type: {pokemon.types.map((type) => type.type.name).join(", ")}
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <p ref={ref} onClick={() => fetchNextPage()}>
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load Newer"
          : "Nothing more to load"}
      </p>
    </>
  );
}
