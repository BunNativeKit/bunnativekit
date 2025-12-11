// Ensures the Zig toolchain is available, downloading if needed.
import { ZigToolchainManager } from "@bunnativekit/toolchain";
import { yap } from "@tailtag/yapper";

const zig = await new ZigToolchainManager().ensureBinary({
    allowSystemZig: false
});
const p = Bun.spawn({
    cmd: [zig.binPath, "version"],
    stdout: "pipe",
    stderr: "inherit",
})

yap.kvTable(Object(zig));
yap.info(await p.stdout.text());