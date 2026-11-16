"use client";

import { useId, useState } from "react";
import {
  concreteBag80,
  concreteBagOptions,
  gravelDensity,
  mulchBag2,
  mulchBagOptions,
  wasteDefault,
  type DefaultValue,
} from "@/data/defaults";
import { aggregateBags, aggregateTons } from "@/lib/calculators/aggregate";
import { concreteBags } from "@/lib/calculators/concrete";
import { rectangleFromRaw, type Issue } from "@/lib/calculators/volume";
import { convertLengthParts, convertThickness, type UnitSystem } from "@/lib/calculators/units";
import { formatDefault, formatQuantity } from "@/lib/format";
import { readNumber } from "@/lib/readNumber";
import { DimensionField } from "./DimensionField";
import { NumberField } from "./NumberField";
import { ResultStage } from "./ResultStage";
import { SegmentedControl } from "./SegmentedControl";
import { SelectField } from "./SelectField";
import { toolFormClass } from "./toolForm";

type Dimension = { primary: string; remainder: string };

export function VolumeTool({
  material,
  emphasis,
  initial,
}: {
  material: "concrete" | "gravel" | "mulch";
  emphasis: "yards" | "bags";
  initial: { lengthFeet: number; widthFeet: number; thicknessInches: number };
}) {
  const baseId = useId();
  const [system, setSystem] = useState<UnitSystem>("us");
  const [length, setLength] = useState<Dimension>({ primary: String(initial.lengthFeet), remainder: "" });
  const [width, setWidth] = useState<Dimension>({ primary: String(initial.widthFeet), remainder: "" });
  const [thickness, setThickness] = useState(String(initial.thicknessInches));
  const [waste, setWaste] = useState(String(wasteDefault.value));
  const options = material === "concrete" ? concreteBagOptions : mulchBagOptions;
  const [bagId, setBagId] = useState(material === "concrete" ? concreteBag80.id : mulchBag2.id);
  const [yieldValue, setYieldValue] = useState(
    formatDefault(material === "gravel" ? gravelDensity.value : material === "concrete" ? concreteBag80.value : mulchBag2.value),
  );

  function changeSystem(next: UnitSystem) {
    if (next === system) return;
    setLength(shiftDimension(length, system, next));
    setWidth(shiftDimension(width, system, next));
    setThickness(shiftThickness(thickness, system, next));
    setSystem(next);
  }

  function changeBag(nextId: string) {
    setBagId(nextId);
    const option = options.find((item) => item.id === nextId);
    if (option) setYieldValue(formatDefault(option.value));
  }

  const planned = rectangleFromRaw({
    system,
    lengthPrimary: length.primary,
    lengthRemainder: length.remainder,
    widthPrimary: width.primary,
    widthRemainder: width.remainder,
    thickness,
    waste,
  });
  const yieldLabel = material === "gravel" ? "density" : material === "concrete" ? "bag yield" : "bag volume";
  const yieldRead = readNumber(yieldValue, { label: yieldLabel, allowZero: false });
  const issues: Issue[] = [
    ...(planned.ok ? [] : planned.issues),
    ...(yieldRead.ok ? [] : [{ field: "yield", message: yieldRead.error }]),
  ];

  const view =
    planned.ok && yieldRead.ok && issues.length === 0
      ? buildView({
          material,
          emphasis,
          system,
          bagId,
          options,
          wastePercent: planned.wastePercent,
          orderCubicYards: planned.volume.orderCubicYards,
          netCubicYards: planned.volume.netCubicYards,
          orderCubicFeet: planned.volume.orderCubicFeet,
          orderCubicMeters: planned.volume.orderCubicMeters,
          amount: yieldRead.value,
        })
      : null;

  const thicknessUnit = system === "us" ? "in" : "cm";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
      <form
        className={toolFormClass}
        noValidate
        onSubmit={(event) => event.preventDefault()}
      >
        <SegmentedControl value={system} onChange={changeSystem} />
        <div className="grid gap-5 sm:grid-cols-2">
          <DimensionField
            idPrefix={`${baseId}-length`}
            legend="Length"
            system={system}
            primary={length.primary}
            remainder={length.remainder}
            onPrimary={(value) => setLength({ ...length, primary: value })}
            onRemainder={(value) => setLength({ ...length, remainder: value })}
            error={issueFor(issues, "length")}
          />
          <DimensionField
            idPrefix={`${baseId}-width`}
            legend="Width"
            system={system}
            primary={width.primary}
            remainder={width.remainder}
            onPrimary={(value) => setWidth({ ...width, primary: value })}
            onRemainder={(value) => setWidth({ ...width, remainder: value })}
            error={issueFor(issues, "width")}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            id={`${baseId}-thickness`}
            label={system === "us" ? "Thickness, inches" : "Thickness, centimeters"}
            value={thickness}
            onChange={setThickness}
            suffix={thicknessUnit}
            hint={
              system === "us"
                ? "Enter 4 for four inches. The calculator divides by 12."
                : "Centimeters. Converted before the volume is calculated."
            }
            error={issueFor(issues, "thickness")}
          />
          <NumberField
            id={`${baseId}-waste`}
            label="Waste"
            value={waste}
            onChange={setWaste}
            suffix="%"
            hint="Added after the net volume. Zero is allowed."
            error={issueFor(issues, "waste")}
          />
        </div>
        {material === "gravel" ? (
          <NumberField
            id={`${baseId}-yield`}
            label="Density"
            value={yieldValue}
            onChange={setYieldValue}
            suffix="ton/yd³"
            hint="Tons per cubic yard. The scale ticket wins if it disagrees."
            error={issueFor(issues, "yield")}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              id={`${baseId}-bag`}
              label={material === "concrete" ? "Bag size" : "Mulch bag"}
              value={bagId}
              onChange={changeBag}
              options={options}
              hint="Choosing a size fills the yield. You can still edit it."
            />
            <NumberField
              id={`${baseId}-yield`}
              label={material === "concrete" ? "Bag yield" : "Bag volume"}
              value={yieldValue}
              onChange={setYieldValue}
              suffix="cu ft"
              hint="The printed bag wins if it disagrees with the starting value."
              error={issueFor(issues, "yield")}
            />
          </div>
        )}
      </form>
      <div className="order-1 lg:sticky lg:top-24 lg:order-2">
        <ResultStage
          labelId={`${baseId}-result`}
          error={view ? undefined : issues[0]?.message}
          emphasis={view?.emphasis}
          secondary={view?.secondary ?? []}
          assumption={view?.assumption}
        />
      </div>
    </div>
  );
}

function issueFor(issues: Issue[], field: string): string | undefined {
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

function shiftThickness(value: string, from: UnitSystem, to: UnitSystem): string {
  const parsed = readNumber(value, { label: "thickness", allowZero: true });
  if (!parsed.ok) return value;
  return convertThickness(parsed.value, from, to);
}

function formatPercent(value: number): string {
  return `${Number.isInteger(value) ? String(value) : formatDefault(value)}%`;
}

function namedBags(option: DefaultValue | undefined, amount: number): string {
  const matches = option && Math.abs(option.value - amount) < 1e-9;
  if (matches) {
    return `${option.label.replace("bag", "bags")} at ${formatDefault(option.value)} cu ft each.`;
  }
  return `Bags at ${formatDefault(amount)} cu ft each.`;
}

function buildView(input: {
  material: "concrete" | "gravel" | "mulch";
  emphasis: "yards" | "bags";
  system: UnitSystem;
  bagId: string;
  options: readonly DefaultValue[];
  wastePercent: number;
  orderCubicYards: number;
  netCubicYards: number;
  orderCubicFeet: number;
  orderCubicMeters: number;
  amount: number;
}) {
  const orderYards = formatQuantity(input.orderCubicYards, "yards");
  const netYards = formatQuantity(input.netCubicYards, "yards");
  const wasteLine = `Waste is ${formatPercent(input.wastePercent)}.`;
  const metricNote = input.system === "metric" ? " Converted from the meters you typed." : "";
  const secondary = [
    { label: "Net cubic yards", value: netYards },
  ];

  let emphasis: { label: string; value: string; caption: string };
  let assumption: string;

  if (input.material === "gravel") {
    emphasis = {
      label: "Cubic yards",
      value: orderYards,
      caption: `Order, with waste included.${metricNote}`,
    };
    secondary.push({ label: "Tons", value: formatQuantity(aggregateTons(input.orderCubicYards, input.amount), "tons") });
    assumption = `${formatDefault(input.amount)} tons per cubic yard. ${wasteLine}`;
  } else if (input.material === "concrete") {
    const bags = formatQuantity(concreteBags(input.orderCubicFeet, input.amount), "bags");
    const option = input.options.find((item) => item.id === input.bagId);
    assumption = `${namedBags(option, input.amount)} ${wasteLine}`;
    if (input.emphasis === "bags") {
      emphasis = { label: "Bags", value: bags, caption: `Rounded up to a whole bag.${metricNote}` };
      secondary.push({ label: "Order cubic yards", value: orderYards });
    } else {
      emphasis = {
        label: "Cubic yards",
        value: orderYards,
        caption: `Order, with waste included.${metricNote}`,
      };
      secondary.push({ label: "Bags", value: bags });
    }
  } else {
    const bags = formatQuantity(aggregateBags(input.orderCubicFeet, input.amount), "bags");
    const option = input.options.find((item) => item.id === input.bagId);
    assumption = `${namedBags(option, input.amount)} ${wasteLine}`;
    emphasis = {
      label: "Cubic yards",
      value: orderYards,
      caption: `Order, with waste included.${metricNote}`,
    };
    secondary.push({ label: "Bags", value: bags });
  }

  if (input.system === "metric") {
    secondary.push({
      label: "Order cubic meters",
      value: formatQuantity(input.orderCubicMeters, "meters"),
    });
  }

  return { emphasis, secondary, assumption };
}
