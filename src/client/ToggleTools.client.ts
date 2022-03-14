export {};
const toggle = game
	.GetService("Players")
	.LocalPlayer.WaitForChild("PlayerGui")
	.WaitForChild("ToolGui")
	.WaitForChild("Toggle") as TextButton;
const frame = game
	.GetService("Players")
	.LocalPlayer.WaitForChild("PlayerGui")
	.WaitForChild("ToolGui")
	.WaitForChild("ScrollingFrame") as ScrollingFrame;
let toggled = false;
toggle.MouseButton1Click.Connect(() => {
	if (toggled === false) {
		frame.Visible = true;
		toggled = true;
	} else {
		frame.Visible = false;
		toggled = false;
	}
});
