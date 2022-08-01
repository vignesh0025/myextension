// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { config } from 'process';
import * as vscode from 'vscode';
import {Search, SearchTreeDataProvider} from "./SearchTreeDataProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "myextension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('myextension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let config: String | undefined = vscode.workspace.getConfiguration("myname").get("name");
		vscode.window.showInformationMessage(' Hello World from MyExtension! ' + config);
		let ate = vscode.window.activeTextEditor;
		console.log(ate?.document.fileName);

		vscode.window.showInputBox({ "title": "InputBox", "placeHolder": "Give Some data" }).then(
			(val) => { console.log(val); }
		);
		
		printDefinitionsForActiveEditor();
	});

	context.subscriptions.push(disposable);

	vscode.languages.registerHoverProvider(["json","jsonc"], new(
			class implements vscode.HoverProvider {
				provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
					const commentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`);
					const content = new vscode.MarkdownString(`[Add comment](${commentCommandUri})`);

					content.isTrusted = true;

					return new vscode.Hover(content);
				};
			})()
		);

	new Search(context);
}

async function printDefinitionsForActiveEditor() {
	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
		console.log("No Active Editor");
		return;
	}

	const definitions = await vscode.commands.executeCommand<vscode.Location[]>(
		'vscode.executeDefinitionProvider',
		activeEditor.document.uri,
		activeEditor.selection.active
	);

	console.log(definitions.length);

	for (const definition of definitions) {
		console.log(definition);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
