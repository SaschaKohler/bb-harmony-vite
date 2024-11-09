import { Database } from "../supabase";

export type BachFlowerRow = Database["public"]["Tables"]["bach_flowers"]["Row"];
export type FlowerSymptomRelation =
  Database["public"]["Tables"]["flower_symptom_relations"]["Row"];

export interface BachFlower extends BachFlowerRow {
  flower_symptom_relations: FlowerSymptomRelation[];
}
