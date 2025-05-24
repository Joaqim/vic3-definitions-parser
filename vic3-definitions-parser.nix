{
  buildNpmPackage,
  lib,
  ...
}:
buildNpmPackage {
  name = "vic3-definitions-parser";
  src = ./.;
  npmPackFlags = ["--ignore-scripts"];
  npmDepsHash = "sha256-oPrby5pJW8WMhTpm8uOmd3pIK32WQ8mj1+0IJnsgpGo=";
  meta = {
    description = "Minimum Paradox definition parser to process Victoria 3's state definitions";
    homepage = "https://github.com/Joaqim/vic3-definitions-parser#README.md";
    mainProgram = "vic3-definitions-parser";
    license = lib.licenses.mit;
  };
}
