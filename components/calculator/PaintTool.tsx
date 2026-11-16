"use client";

import { useId, useState } from "react";
import { paintCoats, paintCoverage } from "@/data/defaults";
import { paintFromRaw } from "@/lib/calculators/paint";
import {
  convertArea,
  convertCoverage,
  convertLengthParts,
  squareFeetToSquareMeters,
  type UnitSystem,
} from "@/lib/calculators/units";
import { formatDefault, formatQuantity } from "@/lib/format";
import { readNumber } from "@/lib/readNumber";
import { DimensionField } from "./DimensionField";
import { NumberField } from "./NumberField";
import { ResultStage } from "./ResultStage";
import { SegmentedControl } from "./SegmentedControl";
import { toolFormClass } from "./toolForm";

type Dimension = { primary: string; remainder: string };

export function PaintTool({
  initial,
}: {
  initial: {
    lengthFeet: number;
    heightFeet: number;
    walls: number;
    openingSqFt: number;
  };
}) {
  const baseId = useId();
  const [system, setSystem] = useState<UnitSystem>("us");
  const [length, setLength] = useState<Dimension>({ primary: String(initial.lengthFeet), remainder: "" });
  const [height, setHeight] = useState<Dimension>({ primary: String(initial.heightFeet), remainder: "" });
  const [walls, setWalls] = useState(String(initial.walls));
  const [coats, setCoats] = useState(String(paintCoats.value));
  const [coverage, setCoverage] = useState(String(paintCoverage.value));
  const [opening, setOpening] = useState(initial.openingSqFt ? String(initial.openingSqFt) : "");

  function changeSystem(next: UnitSystem) {
    if (next === system) return;
    setLength(shiftDimension(length, system, next));
    setHeight(shiftDimension(height, system, next));
    setCoverage(shiftNumber(coverage, (value) => convertCoverage(value, system, next)));
    setOpening(opening.trim() === "" ? "" : shiftNumber(opening, (value) => convertArea(value, system, next)));
    setSystem(next);
  }

  const planned = paintFromRaw({
    system,
    lengthPrimary: length.primary,
    lengthRemainder: length.remainder,
    heightPrimary: height.primary,
    heightRemainder: height.remainder,
    walls,
    coats,
    coverage,
    opening,
  });

  const coverageNumber = Number(coverage);
  const coatsNumber = Number(coats);
  const matchesCoverage = system === "us" && Math.abs(coverageNumber - paintCoverage.value) < 1e-9;
  const coverageLine = matchesCoverage
    ? `${paintCoverage.value} sq ft per gallon.`
    : `${formatDefault(coverageNumber)} ${system === "us" ? "sq ft per gallon" : "sq m per liter"}.`;

  const view = planned.ok
    ? {
        emphasis: {
          label: "Gallons",
          value: formatQuantity(planned.result.gallons, "gallons"),
          caption: "At the coverage and coats in the form.",
        },
        secondary: [
          {
            label: system === "us" ? "Paintable square feet" : "Paintable square meters",
            value:
              system === "us"
                ? formatQuantity(planned.result.area, "sqft")
                : formatQuantity(squareFeetToSquareMeters(planned.result.area), "sqm"),
          },
          ...(planned.result.quarts === null
            ? []
            : [{ label: "Quarts", value: formatQuantity(planned.result.quarts, "bags") }]),
        ],
        assumption: `${coverageLine} Coats: ${Number.isFinite(coatsNumber) ? coatsNumber : coats}.`,
      }
    : null;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
      <form className={toolFormClass} noValidate onSubmit={(event) => event.preventDefault()}>
        <SegmentedControl value={system} onChange={changeSystem} />
        <div className="grid gap-5 sm:grid-cols-2">
          <DimensionField
            idPrefix={`${baseId}-length`}
            legend="Wall length"
            system={system}
            primary={length.primary}
            remainder={length.remainder}
            onPrimary={(value) => setLength({ ...length, primary: value })}
            onRemainder={(value) => setLength({ ...length, remainder: value })}
            error={planned.ok ? undefined : issueFor(planned.issues, "length")}
          />
          <DimensionField
            idPrefix={`${baseId}-height`}
            legend="Wall height"
            system={system}
            primary={height.primary}
            remainder={height.remainder}
            onPrimary={(value) => setHeight({ ...height, primary: value })}
            onRemainder={(value) => setHeight({ ...height, remainder: value })}
            error={planned.ok ? undefined : issueFor(planned.issues, "height")}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            id={`${baseId}-walls`}
            label="Walls"
            value={walls}
            onChange={setWalls}
            hint="Walls that share this length and height."
            error={planned.ok ? undefined : issueFor(planned.issues, "walls")}
          />
          <NumberField
            id={`${baseId}-coats`}
            label="Coats"
            value={coats}
            onChange={setCoats}
            hint="Starts at 2. One coat is a real job."
            error={planned.ok ? undefined : issueFor(planned.issues, "coats")}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            id={`${baseId}-coverage`}
            label="Coverage"
            value={coverage}
            onChange={setCoverage}
            suffix={system === "us" ? "sq ft/gal" : "sq m/L"}
            hint="Use the number printed on the can."
            error={planned.ok ? undefined : issueFor(planned.issues, "coverage")}
          />
          <NumberField
            id={`${baseId}-opening`}
            label="Openings"
            value={opening}
            onChange={setOpening}
            suffix={system === "us" ? "sq ft" : "sq m"}
            hint="Subtracted once from the whole job, not once per wall. Blank means none."
            error={planned.ok ? undefined : issueFor(planned.issues, "opening")}
          />
        </div>
      </form>
      <div className="order-1 lg:sticky lg:top-24 lg:order-2">
        <ResultStage
          labelId={`${baseId}-result`}
          error={view ? undefined : planned.ok ? undefined : planned.issues[0]?.message}
          emphasis={view?.emphasis}
          secondary={view?.secondary ?? []}
          assumption={view?.assumption}
        />
      </div>
    </div>
  );
}

function issueFor(issues: { field: string; message: string }[], field: string): string | undefined {
  return issues.find((issue) => issue.field === field)?.message;
}

function shiftDimension(dimension: Dimension, from: UnitSystem, to: UnitSystem): Dimension {
  const primary = Number(dimension.primary);
  const remainder = dimension.remainder.trim() === "" ? 0 : Number(dimension.remainder);
  if (!Number.isFinite(primary) || primary < 0 || !Number.isFinite(remainder) || remainder < 0) {
    return dimension;
  }
  const next = convertLengthParts(primary, remainder, from, to);
  return { primary: next.primary, remainder: next.remainder === "0" ? "" : next.remainder };
}

function shiftNumber(value: string, convert: (value: number) => string): string {
  const parsed = readNumber(value, { label: "value", allowZero: true });
  if (!parsed.ok) return value;
  const next = convert(parsed.value);
  return next === "0" ? "" : next;
}
