{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    pre-commit-hooks = {
      url = "github:cachix/pre-commit-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    systems.url = "github:nix-systems/default";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    systems,
    pre-commit-hooks,
  }:
    flake-utils.lib.eachSystem (import systems) (
      system: let
        pkgs = import nixpkgs {inherit system;};
      in {
        checks = {
          pre-commit-check = pre-commit-hooks.lib.${system}.run {
            src = ./.;
            hooks = {
              eslint.enable = false; # TODO: Fix this, `Cannot find package '@eslint/js' imported from eslint.config.mjs`
              commitizen.enable = true;
            };
          };
        };
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs
            pkgs.nodePackages.typescript
            pkgs.nodePackages.typescript-language-server
          ];

          inherit (self.checks.${system}.pre-commit-check) shellHook;
        };

        packages.default = pkgs.callPackage ./vic3-definitions-parser.nix {};

        apps.default = {
          type = "app";
          program = "${pkgs.lib.getExe self.packages.${system}.default}";
        };
      }
    );
}
