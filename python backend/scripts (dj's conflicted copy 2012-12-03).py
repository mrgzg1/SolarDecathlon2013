import argparse

parser = argparse.ArgumentParser(description='Command for Etho_g')
parser.add_argument('command')

if __name__ == "__main__":
    args = parser.parse_args()
    if args.command == "mkdb":
        import models.main
        models.main.create_all()
