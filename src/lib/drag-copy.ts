export function getDropTargetLabel(phaseNumber: number) {
  if (phaseNumber === 0) return "Soltar em Optativas";
  return `Soltar no semestre ${phaseNumber}`;
}
